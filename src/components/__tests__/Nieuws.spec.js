import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter'
import Nieuws from '@/components/Nieuws.vue'; // Adjust the path according to your project structure
import Toast from '@/components/Toast.vue'; // Adjust the path according to your project structure
import { isInvalidImage } from '/validator.js'
import { sendMail } from 'wkb-utils';



//vi.mock('axios');
//vi.mock('@/components/Toast.vue');
vi.mock('wkb-utils', () => ({
  sendMail: vi.fn(),
}));
vi.mock('/validator.js', () => ({
  isInvalidImage: vi.fn(),
}));

const API_URL = import.meta.env.VITE_API_URL;
const MAILTO = import.meta.env.VITE_MAILTO;


describe('Nieuws.vue', () => {
  let wrapper;
  const mock = new MockAdapter(axios)

  beforeEach( async () => {    
    wrapper = mount(Nieuws, {
      global: {
        components: { Toast },
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks()
  });

  it('renders correctly', async () => {    
    await wrapper.vm.$nextTick() // Wait for the next DOM update cycle
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('div.card').exists()).toBe(true);
  });

  it('fetches nieuws items on mount', async () => {
    // Reset the mock adapter before each test
    //mock.reset()
    // Mock the GET request to return a specific response
    mock.onGet(`${API_URL}/get-nieuws`).reply(200, [
      { _id: '1', titel_kort: 'Test Item 1', datum_: '2024-05-30' },
      { _id: '2', titel_kort: 'Test Item 2', datum_: '2024-05-31' },      
      ] 
    );

    await axios.get(`${API_URL}/get-nieuws`).then(function (response) {
      console.log('test response.data:', response.data);
    });
    
    wrapper = mount(Nieuws, {
      global: {
        components: { Toast },
      },
    });
    
    await wrapper.vm.$nextTick() // Wait for the next DOM update cycle

    // Wait for the axios call to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Find the select element
    const select = wrapper.find('select#nieuws_item')

    // Check if the select element exists
    expect(select.exists()).toBe(true)

    // Find all option elements within the select
    const options = select.findAll('option')
    console.log('options: ', options);
    // Check if the number of options matches the mocked data
    expect(options).toHaveLength(2);

    // Check if the option elements have the correct text and value
    expect(options[0].text()).toBe('Test Item 1')
    expect(options[0].attributes('value')).toBe('1')
    expect(options[1].text()).toBe('Test Item 2')
    expect(options[1].attributes('value')).toBe('2')
    
  });

  it('shows validation message for required fields', async () => {
    await wrapper.find('form').trigger('submit.prevent');

    expect(wrapper.find('#titel_kort_feedback').text()).toBe('Dit veld is verplicht.');
    expect(wrapper.find('#inhoud_lang_feedback').text()).toBe('Dit veld is verplicht.');
  });

  it('does not submit form with invalid input', async () => {
    vi.spyOn(axios, 'post').mockResolvedValue({ data: { info: '[MOCK] Form submission failed' } });

    await wrapper.find('form').trigger('submit.prevent');

    expect(axios.post).not.toHaveBeenCalled();
    expect(wrapper.vm.cancelEnabled).toBe(true);
    expect(wrapper.vm.editMode).toBe(false);
  });

  it('sends mail and shows toast message when uploading a file with invalid extension', async () => {
    const subject = 'WKB nieuws upload'
    
    // Create a mock file with an invalid extension
    const file = new File(['content'], 'test.txt', { type: 'text/plain' });

    // Mock the isInvalidImage function to return an error message for invalid files
    isInvalidImage.mockReturnValue('Bestandstype is niet toegestaan');

    // Find the file input element and set its value
    const fileInput = wrapper.find('input[type="file"]');
    Object.defineProperty(fileInput.element, 'files', {
      value: [file],
      writable: false,
    });

    // Trigger the file upload event
    await fileInput.trigger('change');
    await wrapper.vm.handleFileUpload();

    // Check if the isInvalidImage function was called with the file
    expect(isInvalidImage).toHaveBeenCalledWith(file);

    // Check if the sendMail function was called with the correct arguments
    expect(sendMail).toHaveBeenCalledWith(MAILTO, subject, wrapper.vm.mailText);

    // Check if the toast message was set correctly
    expect(wrapper.vm.toastMessage).toBe('Bestandstype is niet toegestaan');
    expect(wrapper.vm.toastVisible).toBe(true);
  });
  
  it('sends an email and shows toast message when a file is successfully uploaded', async () => {
    const subject = 'WKB nieuws upload'

    // Create a mock file with a valid extension
    const file = new File(['content'], 'test.png', { type: 'image/png' });

    // Mock the isInvalidImage function to return no error message for valid files
    isInvalidImage.mockReturnValue('');

    // Mock the axios post request for file upload
    mock.onPost(`${API_URL}/upload`).reply(200, {
      message: '[MOCK] Het bestand is geupload',
    });

    // Find the file input element and set its value
    const fileInput = wrapper.find('input[type="file"]');
    Object.defineProperty(fileInput.element, 'files', {
      value: [file],
      writable: false,
    });

    // Trigger the file upload event
    await fileInput.trigger('change');
    await wrapper.vm.handleFileUpload();

    // Check if the sendMail function was called with the correct arguments
    expect(sendMail).toHaveBeenCalledWith(MAILTO, subject, wrapper.vm.mailText, file);

    expect(wrapper.vm.toastVisible).toBe(true);
    // console.log('wrapper message: ', wrapper.vm.message)
    expect(wrapper.vm.toastMessage).toBe('[MOCK] Het bestand is geupload');
  });

  it('submits form with valid input', async () => {
    
      const mockFormData = {
      datum_: '2024-05-30',
      titel_kort: 'Test Title',
      titel_lang: 'Test Title Long',
      inhoud_kort: 'Test Short Content',
      inhoud_lang: 'Test Long Content',
      foto_naam: 'test.png',
      visibility: true,
    };
    // Set the form data in the component
    wrapper.vm.form = mockFormData;

    vi.spyOn(axios, 'post').mockResolvedValue({ data: { info: '[MOCK] Form submitted successfully', collection: [] } });
    const form = wrapper.find('form');
    form.element.checkValidity = () => true;
    await form.trigger('submit.prevent');

    await wrapper.vm.$nextTick() // Wait for the next DOM update cycle
    
    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/update-nieuws`, mockFormData);
    expect(wrapper.vm.toastMessage).toBe('[MOCK] Form submitted successfully');
    expect(wrapper.vm.toastVisible).toBe(true);
    // Check if the sendMail function was called with the correct arguments
    expect(sendMail).toHaveBeenCalledWith(MAILTO, 'WKB nieuws update', wrapper.vm.mailText);

    expect(wrapper.vm.objects).toEqual([]);
  });

  it('deletes a nieuws item', async () => {
    
    const mockFormData = { _id: '1', titel_kort: 'Test Item 1' };
    // Set the form data in the component
    wrapper.vm.form = mockFormData;

    vi.spyOn(axios, 'post').mockResolvedValue({ data: { info: '[MOCK] Item deleted', collection: [] } });

    await wrapper.vm.deleteDocument(mockFormData);

    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/delete-nieuws`, mockFormData);
    expect(wrapper.vm.toastMessage).toBe('[MOCK] Item deleted');
    expect(wrapper.vm.toastVisible).toBe(true);
    // Check if the sendMail function was called with the correct arguments
    expect(sendMail).toHaveBeenCalledWith(MAILTO, 'WKB nieuws delete', wrapper.vm.mailText);

    expect(wrapper.vm.objects).toEqual([]);
  });
});
