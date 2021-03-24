import React, {useState} from 'react';
import Field from "../components/forms/Field";
import {Link} from "react-router-dom";
import axios from 'axios'
import usersApi from "../services/usersApi";
import {toast} from "react-toastify";

const RegisterPage = ({history}) => {

    const [user, setUser] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: ''
    })

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: ''
    })

    const handleChange = (e) => {
        const name = e.currentTarget.name
        const value = e.currentTarget.value
        setUser({...user, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const apiErrors = {}

        if (user.password !== user.passwordConfirm) {
            apiErrors.passwordConfirm = "Votre confirmation de mot de passe n'est pas confirme avec le mot de passe original"
            setErrors(apiErrors)
            return;
        }

        try {
            await usersApi.register(user)
            setErrors({})
            toast.success("Vous êtes désormains inscrit, vous pouvez vous connecter !")
            history.replace('/login')
        } catch (error) {
            const {violations} = error.response.data

            if (violations) {
                const apiErrors = {};
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                })
                setErrors(apiErrors)
            }
            toast.error("Des erreurs sont présentes dans votre formulaire.")
        }
    }

    return (
        <>
            <h1>Inscription</h1>
            <form onSubmit={handleSubmit}>
                <Field name="firstName" label="Prénom" placeholder="Votre prénom" error={errors.firstName} value={user.firstName} onChange={handleChange}/>
                <Field name="lastName" label="Nom de famille" placeholder="Votre nom de famille" error={errors.lastName} value={user.lastName} onChange={handleChange}/>
                <Field name="email" type="email" label="Email" placeholder="Votre email" error={errors.email} value={user.email} onChange={handleChange}/>
                <Field name="password" type="password" label="Mot de passe" placeholder="Votre mot de passe" error={errors.password} value={user.password} onChange={handleChange}/>
                <Field name="passwordConfirm" type="password" label="Confirmation de Mot de passe" placeholder="Confirmez votre mot de passe" error={errors.passwordConfirm} value={user.passwordConfirm} onChange={handleChange}/>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Confirmation</button>
                    <Link to="/login" className="btn btn-link">J'ai déjà un compte</Link>
                </div>
            </form>
        </>
    )
}

export default RegisterPage
