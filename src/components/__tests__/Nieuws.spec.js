import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter'
import Nieuws from '@/components/Nieuws.vue'; // Adjust the path according to your project structure
import Toast from '@/components/Toast.vue'; // Adjust the path according to your project structure

// Create a new instance of MockAdapter
const mock = new MockAdapter(axios)

vi.mock('axios');
vi.mock('wkb-utils', () => ({
  sendMail: vi.fn(),
}));

const API_URL = import.meta.env.VITE_API_URL;
const MAILTO = import.meta.env.VITE_MAILTO;

describe('Nieuws.vue', () => {
  let wrapper;

  beforeEach( async () => {
    // Reset the mock adapter before each test
    mock.reset()
    // Mock the GET request to return a specific response
    mock.onGet(`${API_URL}/get-nieuws`).reply(200,        
      [
        // Add your mock data here
        { _id: '1', titel_kort: 'Test Item 1', datum_: '2024-05-30' },
        { _id: '2', titel_kort: 'Test Item 2', datum_: '2024-05-31' },      
      ]
  );

    
    wrapper = mount(Nieuws, {
      global: {
        components: { Toast },
      },
    });
    await wrapper.vm.$nextTick() // Wait for the next DOM update cycle
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.find('div.card').exists()).toBe(true);
  });

  it('fetches nieuws items on mount', async () => {

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

    /*// Check if the option elements have the correct text and value
    expect(options[0].text()).toBe('Test Item 1')
    expect(options[0].attributes('value')).toBe('1')
    expect(options[1].text()).toBe('Test Item 2')
    expect(options[1].attributes('value')).toBe('2')
    */
  });
/*
  it('shows validation message for required fields', async () => {
    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    expect(wrapper.find('#titel_kort_feedback').text()).toBe('Dit veld is verplicht.');
    expect(wrapper.find('#inhoud_lang_feedback').text()).toBe('Dit veld is verplicht.');
  });

  it('does not submit form with invalid input', async () => {
    axios.post.mockResolvedValue({ data: { info: 'Form submission failed' } });
    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    expect(axios.post).not.toHaveBeenCalled();
    expect(wrapper.vm.cancelEnabled).toBe(true);
    expect(wrapper.vm.editMode).toBe(false);
  });

  it('shows toast message on file validation error', async () => {
    const fileInput = wrapper.find('input[type="file"]');
    const file = new File([''], 'test.png', { type: 'image/png' });
    const mockIsValidImage = vi.fn(() => 'Invalid image');
    wrapper.vm.isValidImage = mockIsValidImage;

    await fileInput.setValue(file);
    await wrapper.vm.handleFileUpload();

    expect(mockIsValidImage).toHaveBeenCalledWith(file);
    expect(wrapper.vm.toastMessage).toBe('Invalid image');
    expect(wrapper.vm.toastVisible).toBe(true);
  });

  it('submits form with valid input', async () => {
    axios.post.mockResolvedValue({ data: { info: 'Form submitted successfully', collection: [] } });
    wrapper.vm.form = {
      datum_: '2024-05-30',
      titel_kort: 'Test Title',
      titel_lang: 'Test Title Long',
      inhoud_kort: 'Test Short Content',
      inhoud_lang: 'Test Long Content',
      foto_naam: 'test.png',
      visibility: true,
    };

    const form = wrapper.find('form');
    await form.trigger('submit.prevent');

    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/update-nieuws`, wrapper.vm.form);
    expect(wrapper.vm.toastMessage).toBe('Form submitted successfully');
    expect(wrapper.vm.toastVisible).toBe(true);
    expect(wrapper.vm.objects).toEqual([]);
  });

  it('deletes a nieuws item', async () => {
    const mockData = [
      { _id: '1', titel_kort: 'Test Item 1', datum_: '2024-05-30' },
      { _id: '2', titel_kort: 'Test Item 2', datum_: '2024-05-31' },
    ];
    wrapper.vm.objects = mockData;
    wrapper.vm.selectedObjectId = '1';
    wrapper.vm.form = { _id: '1', titel_kort: 'Test Item 1' };

    axios.post.mockResolvedValue({ data: { info: 'Item deleted', collection: [] } });

    await wrapper.vm.deleteDocument();

    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/delete-nieuws`, wrapper.vm.form);
    expect(wrapper.vm.toastMessage).toBe('Item deleted');
    expect(wrapper.vm.toastVisible).toBe(true);
    expect(wrapper.vm.objects).toEqual([]);
  });*/
});
