import axios from "axios";

const BASE_URL = 'https://pixabay.com/api';

async function fetchImages(query, page, per_page = 40) {
    const searchParams = new URLSearchParams({
        key: '30234231-b0be7596e264e2dfb6014cc0b',
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page,
        per_page,
    });

    const res = await axios.get(`${BASE_URL}/?${searchParams}`);
    return res.data;
}

export {fetchImages};