import React, {useState, useEffect} from 'react';
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import {Link} from "react-router-dom";
import customersApi from "../services/customersApi";
import axios from "axios";
import invoicesApi from "../services/invoicesApi";
import {toast} from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";

const InvoicePage = ({history, match}) => {

    const {id = "new"} = match.params;

    const [invoice, setInvoice] = useState({
        amount: "",
        status: "SENT",
        customer: ""
    })

    const [errors, setErrors] = useState({
        amount: "",
        status: "",
        customer: ""
    })

    const [customers, setCustomers] = useState([])
    const [editing, setEditing] = useState(false)
    const [loading, setLoading] = useState(true)

    const fetchInvoice = async id => {
        try {
            const data = await invoicesApi.find(id)
            const {amount, status, customer} = data;
            setInvoice({amount, status, customer: customer.id})
            setLoading(false)
        } catch (error) {
            toast.error("Une erreur est survenue lors du chargement de la facture")
            setInvoice({
                amount: "",
                customer: "",
                status: "SENT"
            })
            history.replace('/invoices')
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [])

    useEffect(() => {
        if (id !== "new") {
            setEditing(true)
            fetchInvoice(id)
        }
    }, [id])

    const fetchCustomers = async () => {
        try {
            const data = await customersApi.findAll()
            setCustomers(data)
            setLoading(false)
            if (!invoice.customer) {
                setInvoice({...invoice, customer: data[0]})
            }
        } catch (error) {
            toast.error("Une erreur est survenue lors du chargement des clients.")
            history.replace('/invoices')
        }
    }

    const handleChange = (e) => {
        const name = e.currentTarget.name
        const value = e.currentTarget.value
        setInvoice({...invoice, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (editing) {
                await invoicesApi.update(id, invoice)
                toast.success("La facture a bien été modifiée.")
            } else {
                await invoicesApi.create(invoice)
                toast.success("La facture a bien été enregistrée.")
                history.replace("/invoices")
            }
        } catch (error) {
            if (error.response.data.violations) {
                const apiErrors = {};
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors)
            }
            toast.error("Des erreurs sont présentes dans votre formulaire.")
        }

    }

    return (
        <>
            {editing
            && <h1>Modification d'une facture</h1>
            || <h1>Création d'une facture</h1>
            }
            {loading && <FormContentLoader/>}
            {!loading &&
            <form onSubmit={handleSubmit}>
                <Field name="amount" type="number" placeholder="Montant de la facture" label="Montant"
                       onChange={handleChange} value={invoice.amount} error={errors.amount}/>

                <Select name="customer" label="Client" value={invoice.customer} error={errors.customer}
                        onChange={handleChange}>
                    {customers.map(customer =>
                        <option key={customer.id} value={customer.id}>
                            {customer.firstName} {customer.lastName}
                        </option>
                    )}
                </Select>

                <Select name="status" label="Status" value={invoice.status} error={errors.status}
                        onChange={handleChange}>
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                </Select>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/invoices" className="btn btn-link">Retour aux factures</Link>
                </div>
            </form>
            }
        </>
    )
}

export default InvoicePage
