import axios from 'axios';

function findAll() {
    return axios
        .get("http://localhost:8000/api/invoices")
        .then(response => response.data["hydra:member"])
}

function find() {
    return axios.get("http://localhost:8000/api/invoices/" + id)
        .then(response => response.data)
}

function update(id, invoice) {
    axios.put("http://localhost:8000/api/invoices/" + id,
        {
            ...invoice,
            customer: `/api/customers/${invoice.customer}`
        })
}

function create(invoice) {
    axios.post("http://localhost:8000/api/invoices",
        {
            ...invoice,
            customer: `/api/customers/${invoice.customer}`
        });
}

function deleteInvoice(id) {
    return axios
        .delete("http://localhost:8000/api/invoices/" + id);
}

export default {
    find,
    findAll,
    create,
    update,
    delete: deleteInvoice
}
