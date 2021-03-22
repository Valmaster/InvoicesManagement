import React from 'react'

// passe la forme des données mais pas les données directement
export default React.createContext({
    isAuthenticated: false,
    setIsAuthenticated: (value) => {}
})