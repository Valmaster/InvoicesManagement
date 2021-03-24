import React, {useState, useContext} from 'react';
import authApi from "../services/authApi";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";

const LoginPage = ({history}) => {

    const {setIsAuthenticated} = useContext(AuthContext)

    const [credentials, setCredentials] = useState({
        username: "",
        password: ""
    });

    const [error, setError] = useState("")

    const handleChange = (e) => {
        const value = e.currentTarget.value;
        const name = e.currentTarget.name;

        // [] pour modif username dans l'objet credentials sinon ça add une nouvelle ligne
        setCredentials({...credentials, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authApi.authenticate(credentials)
            setError("")
            setIsAuthenticated(true)
            history.replace("/customers")
        } catch (error) {
            setError("Aucun compte ne possède cette adresse email")
            console.log(error.response)
        }

    }

    return (
        <>
            <h1>Connexion à l'application</h1>

            <form onSubmit={handleSubmit}>
                <Field label="Adresse email" name="username" value={credentials.username} onChange={handleChange}
                       placeholder="Adresse email de connexion" error={error}/>
                <Field label="Mot de passe" name="password" type="password" value={credentials.password} onChange={handleChange}
                       placeholder="Mot de passe" error={error}/>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Connexion</button>
                </div>
            </form>
        </>
    )
}

export default LoginPage