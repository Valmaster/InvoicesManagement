import React, {useState, useEffect} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import customersApi from "../services/customersApi";
import {toast} from "react-toastify";
import FormContentLoader from "../components/loaders/FormContentLoader";

const CustomerPage = ({match, history}) => {

    const {id = "new"} = match.params

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [customer, setCustomer] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    })

    const [errors, setErrors] = useState({
        lastName: "",
        firstName: "",
        email: "",
        company: ""
    })

    const fetchCustomer = async id => {
        try {
            const data = await customersApi.find(id)
            const {firstName, lastName, email, company} = data;
            setCustomer({firstName, lastName, email, company})
            setLoading(false)
        } catch (error) {
            toast.error("Une erreur s'est produite lors du chargement du client.")
            history.replace("/customers")
        }
    }

    useEffect(() => {
        if (id !== "new") {
            setLoading(true)
            setEditing(true)
            fetchCustomer(id)
        }
    }, [id])

    const handleChange = (e) => {
        const name = e.currentTarget.name
        const value = e.currentTarget.value
        setCustomer({...customer, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setErrors({
                lastName: "",
                firstName: "",
                email: "",
                company: ""
            })
            if (editing) {
                await customersApi.update(id, customer)
                toast.success("Le client a bien été modifié.")
            } else {
                await customersApi.create(customer)
                toast.success("Le client a bien été crée.")
                history.replace("/customers")
            }
        } catch (error) {
            if (error.response.data.violations) {
                const apiErrors = {};
                error.response.data.violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors)
                toast.error("Des erreurs sont présentes dans votre formulaire.")
            }
        }
    }

    return (
        <>
            {
                !editing
                && <h1>Création d'un client</h1>
                || <h1>Modification d'un client</h1>
            }
            {loading && <FormContentLoader/>}
            {!loading &&
            <form onSubmit={handleSubmit}>
                <Field name="lastName" label="Nom de famille" placeholder="Nom de famille du client"
                       value={customer.lastName}
                       onChange={handleChange} error={errors.lastName}/>
                <Field name="firstName" label="Prénom de famille" placeholder="Prénom du client"
                       value={customer.firstName}
                       onChange={handleChange} error={errors.firstName}/>
                <Field name="email" type="email" label="Email" placeholder="Email du client" value={customer.email}
                       onChange={handleChange} error={errors.email}/>
                <Field name="company" label="Entreprise" placeholder="Entreprise du client" value={customer.company}
                       onChange={handleChange} error={errors.company}/>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Enregistrer</button>
                    <Link to="/customers" className="btn btn-link">Retour</Link>
                </div>
            </form>
            }
        </>
    )
}

export default CustomerPage
