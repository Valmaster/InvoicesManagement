import React from 'react'

const Field = ({name, label, value, onChange, placeholder = "", type = "text", error = ""}) => {
    return (
        <div className="from-group">
            <label htmlFor={name}>{label}</label>
            <input value={value}
                   type={type}
                   placeholder={placeholder || label}
                   name={name}
                   id={name}
                   className={"form-control" + (error && " is-invalid")}
                   onChange={onChange}/>
            {error && <p className="invalid-feddback">{error}</p>}
        </div>
    )
}

export default Field