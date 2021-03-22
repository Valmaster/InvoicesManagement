import React, {useState, useContext} from 'react';
import authApi from "../services/authApi";
import AuthContext from "../contexts/AuthContext";

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
                <div className="from-group">
                    <label htmlFor="username"></label>
                    <input value={credentials.username} type="email" placeholder="Adresse email de connexion"
                           name="username" id="username" className={"form-control" + (error && " is-invalid") } onChange={handleChange}/>
                    {error && <p className="invalid-feddback">{error}</p>}
                </div>
                <div className="from-group">
                    <label htmlFor="password"></label>
                    <input value={credentials.password} type="password" placeholder="Mot de passe" name="password"
                           id="password" className="form-control" onChange={handleChange}/>
                </div>

                <div className="form-group">
                    <button type="submit" className="btn btn-success">Connexion</button>
                </div>
            </form>
        </>
    )
}

export default LoginPage