// imports importants
import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import {Navbar} from "./js/components/Navbar";
import {HomePage} from "./js/pages/HomePage";
import {HashRouter, Switch, Route, withRouter} from "react-router-dom";
import './css/app.css';
import './bootstrap';
import {CustomersPage} from "./js/pages/CustomersPage";
import InvoicesPage from "./js/pages/InvoicesPage";
import LoginPage from "./js/pages/LoginPage";
import authApi from "./js/services/authApi";
import AuthContext from "./js/contexts/AuthContext";
import PrivateRoute from "./js/components/PrivateRoute";
import CustomerPage from "./js/pages/CustomerPage";
import InvoicePage from "./js/pages/InvoicePage";
import RegisterPage from "./js/pages/RegisterPage";
import {ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import {toast} from "react-toastify";

authApi.setup();

const App = () => {

    const [isAuthenticated, setIsAuthenticated] = useState(authApi.isAuthenticated)

    const NavbarWithRouter = withRouter(Navbar)


    // on peut aussi l'écrire comme ça car clé et valeur sont égales
    /*
    const contextValue = {
        isAuthenticated,
        setIsAuthenticated
    }
    */

    return (
        <AuthContext.Provider value={{
            isAuthenticated: isAuthenticated,
            setIsAuthenticated: setIsAuthenticated
        }}>
            <HashRouter>
                <NavbarWithRouter/>

                <main className="container pt-5">
                    <Switch>
                        <Route path="/login" component={LoginPage}/>
                        <PrivateRoute path="/register" component={RegisterPage}/>
                        <PrivateRoute path="/invoices/:id" component={InvoicePage}/>
                        <PrivateRoute path="/invoices" component={InvoicesPage}/>
                        <PrivateRoute path="/customers/:id" component={CustomerPage}/>
                        <PrivateRoute path="/customers" component={CustomersPage}/>
                        <Route path="/" component={HomePage}/>
                    </Switch>
                </main>

            </HashRouter>
            <ToastContainer position={toast.POSITION.TOP_CENTER}/>
        </AuthContext.Provider>
    )
}


const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement)
