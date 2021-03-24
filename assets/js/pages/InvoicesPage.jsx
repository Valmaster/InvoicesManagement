import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Pagination} from "../components/Pagination";
import moment from "moment";
import invoicesApi from "../services/invoicesApi";
import {Link} from "react-router-dom";
import {toast} from "react-toastify";
import TableLoader from "../components/loaders/TableLoaders";


const STATUS_CLASSES = {
    PAID: "success",
    SENT: "info",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}

const InvoicesPage = props => {

    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    const fetchInvoices = async () => {
        try {
            const data = await invoicesApi.findAll()
            setInvoices(data);
            setLoading(false)
        } catch (error) {
            toast.error("Erreur lors du chargement des factures.")
        }
    }

    useEffect(() => {
        fetchInvoices();
    }, [])

    const handlePageChange = page => setCurrentPage(page);

    const handleSearch = event => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    }

    const handleDelete = async id => {
        const originalInvoices = [...invoices];

        setInvoices(invoices.filter(invoice => invoice.id !== id))

        try {
            await invoicesApi.delete(id)
            toast.success("la facture a bien été supprimée.")
        } catch (error) {
            toast.error("Une erreur est survenue.")
            setInvoices(originalInvoices)
        }
    }

    const filteredInvoices = invoices.filter(i => i.customer.lastName.toLowerCase().includes(search.toLowerCase())
        || i.customer.firstName.toLowerCase().includes(search.toLowerCase())
        || i.amount.toString().startsWith(search.toLowerCase())
        || STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase()))

    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage);


    const formatDate = (str) => moment(str).format("DD/MM/YYYY")

    return (
        <>
            <div className="d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link to="/invoices/new" className="btn btn-primary">Créer une facture</Link>
            </div>
            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control"/>
            </div>
            <table className="table table-hover">
                <thead>
                <tr>
                    <th>Numéro</th>
                    <th>Client</th>
                    <th className="text-center">Date d'envoi</th>
                    <th className="text-center">Status</th>
                    <th className="text-center">Montant</th>
                    <th>Actions</th>
                </tr>
                </thead>
                {!loading &&
                <tbody>
                {paginatedInvoices.map(invoice =>
                    <tr key={invoice.id}>
                        <td>{invoice.chrono}</td>
                        <td>
                            <Link to={"/customers/" + invoice.customer.id}>{invoice.customer.firstName} {invoice.customer.lastName}</Link>
                        </td>
                        <td className="text-center">{formatDate(invoice.sentAt)}</td>
                        <td className="text-center">
                            <span
                                className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                        </td>
                        <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                        <td>
                            <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary mr-1">Editer</Link>
                            <button className="btn btn-sm btn-danger"
                                    onClick={() => handleDelete(invoice.id)}>Supprimer
                            </button>
                        </td>
                    </tr>
                )}
                </tbody>
                }
            </table>
            {loading && <TableLoader/>}

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handlePageChange}
                        length={invoices.length}/>
        </>

    )
}

export default InvoicesPage
