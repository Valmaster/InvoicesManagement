// imports importants
import React from 'react';
import ReactDOM from 'react-dom';
import {Navbar} from "./js/components/Navbar";
import {HomePage} from "./js/pages/HomePage";
import {HashRouter, Switch, Route} from "react-router-dom";
import './css/app.css';
import './bootstrap';
import {CustomersPageWithPagination} from "./js/pages/CustomersPageWithPagination";
import {CustomersPage} from "./js/pages/CustomersPage";

console.log("Hello World !!!")

const App = () => {
    return (
        <HashRouter>
            <Navbar/>
            <main className="container pt-5">
                <Switch>
                    <Route path="/customers" component={CustomersPage} />
                    <Route path="/" component={HomePage} />
                </Switch>
            </main>
        </HashRouter>
    )
}


const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement)
