import React, { useState } from "react";

const useFields = (initialState) => {
    const [formData, setFormData] = useState(initialState);

    const handleChange = evt => {
        setFormData(formData => ({
            ...formData,
            [evt.target.name]: evt.target.value
        }))
    }
    return [formData, handleChange];
};

export default useFields;