import React, {useEffect, useState} from 'react';
import {Pagination} from "../components/Pagination";
import customersApi from "../services/customersApi";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import TableLoader from "../components/loaders/TableLoaders";

export const CustomersPage = props => {

    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        customersApi.findAll()
            .then(data => {
                setCustomers(data)
                setLoading(false)
            })
            .catch(error => toast.error("Une erreur s'est produite lors du chargement de la liste des clients."))
    }, [])

    const handleDelete = (id) => {

        // Copie de la liste des customers
        const originalCustomers = [...customers];
        // suppression de l'élément au click
        setCustomers(customers.filter(customer => customer.id !== id))

        /*
            si catch alors on remet le réinitialise customers comme avant, on fait ça pour des questions de rapidité
            au niveau du chargement de la page
         */
        customersApi.delete(id)
            .then(response => toast.success("Le client a bien été supprimé."))
            .catch(error => {
                setCustomers(originalCustomers)
                toast.error("Une erreur s'est produite lors de la suppression du client.")
            })
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    }

    const handleSearch = event => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    }

    const itemsPerPage = 10;
    const filteredCustomers = customers.filter(c => c.firstName.toLowerCase().includes(search.toLowerCase())
        || c.lastName.toLowerCase().includes(search.toLowerCase())
        || c.email.toLowerCase().includes(search.toLowerCase())
        || (c.company && c.company.toLowerCase().includes(search.toLowerCase())))
    const paginatedCustomers = Pagination.getData(filteredCustomers, currentPage, itemsPerPage);

    return (
        <>
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h1>Liste des clients</h1>
                <Link className="btn btn-primary" to="/customers/new">Créer un client</Link>
            </div>
            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control"/>
            </div>
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

                {!loading &&
                <tbody>
                {paginatedCustomers.map(customer =>
                    <tr key={customer.id}>
                        <td>{customer.id}</td>
                        <td>
                            <Link to={"/customers/" + customer.id}>{customer.firstName} {customer.lastName}</Link>
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
                            <button onClick={() => handleDelete(customer.id)}
                                    disabled={customer.invoices.length > 0}
                                    className="btn btn-sm btn-danger">Supprimer
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>
                }
            </table>
            {loading && <TableLoader/>}

            {itemsPerPage < filteredCustomers.length &&
            (
                <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={filteredCustomers.length}
                            onPageChanged={handlePageChange}/>
            )}
        </>
    )
}
