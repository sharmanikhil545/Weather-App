import axios from "axios";
export const getAll = async () => {
    const res = await axios.get('http://localhost:5000/getAll');
    return res.data
}