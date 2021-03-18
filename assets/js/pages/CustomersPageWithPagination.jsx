import React, {useEffect, useState} from 'react';
import {Pagination} from "../components/Pagination";
import axios from "axios";

export const CustomersPageWithPagination = props => {

    const [customers, setCustomers] = useState([]);
    const [totalItems, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    useEffect(() => {
        axios
            .get(`http://localhost:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
            .then(response => {
                setCustomers(response.data["hydra:member"])
                setTotalItem(response.data["hydra:totalItems"])
                setLoading(false)
            })
            .catch(error => console.log(error.response))
    }, [currentPage])

    const handleDelete = (id) => {

        // Copie de la liste des customers
        const originalCustomers = [...customers];
        // suppression de l'élément au click
        setCustomers(customers.filter(customer => customer.id !== id))

        /*
            si catch alors on remet le réinitialise customers comme avant, on fait ça pour des questions de rapidité
            au niveau du chargement de la page
         */
        axios.delete("http://localhost:8000/api/customers/" + id)
            .then(response => console.log("OK"))
            .catch(error => setCustomers(originalCustomers))
    };

    const handlePageChange = (page) => {
        setLoading(true)
        setCurrentPage(page);
    }

    return (
        <>
            <h1>Liste des clients (pagination)</h1>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Entreprise</th>
                    <th className="text-center">Factures</th>
                    <th className="text-center">Montant total</th>
                    <th/>
                </tr>
                </thead>

                <tbody>
                {loading && (<tr>
                    <td>Chargement ...</td>
                </tr>)}
                {!loading && customers.map(customer =>
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>
                            <a href="#">{customer.firstName} {customer.lastName}</a>
                        </td>
                        <td>{customer.email}</td>
                        <td>{customer.company}</td>
                        <td className="text-center">
                            <span className="badge badge-primary">{customer.invoices.length}</span>
                        </td>
                        <td className="text-center">
                            {customer.totalAmount.toLocaleString()} €
                        </td>
                        <td>
                            <button onClick={() => handleDelete(customer.id)} disabled={customer.invoices.length > 0}
                                    className="btn btn-sm btn-danger">Supprimer
                            </button>
                        </td>
                    </tr>
                )}

                </tbody>
            </table>


            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={totalItems}
                        onPageChanged={handlePageChange}/>
        </>
    )
}