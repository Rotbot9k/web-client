import React, {useState} from 'react'
import {useHistory} from 'react-router-dom';
import secureApiFetch from '../../services/api';
import Breadcrumb from '../ui/Breadcrumb';
import BtnPrimary from '../ui/buttons/BtnPrimary';
import Title from '../ui/Title';
import CancelButton from "../ui/buttons/Cancel";

const UserCreationForm = () => {
    const history = useHistory()
    const [userData, setUserData] = useState({
        name: null,
        password: null,
        email: null,
        role: null,
        sendEmailToUser: false
    })
    const [loading, setLoading] = useState(false)
    const handleCreate = async () => {
        setLoading(true)
        await secureApiFetch(`/users`, {
            method: 'POST',
            body: JSON.stringify(userData)
        }).then(() => {
            history.push('/users/')
        })
            .finally(() => {
                setLoading(false);
            })
    }
    const handleFormChange = e => {
        const target = e.target;
        const name = target.name;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        setUserData({
            ...userData, [name]: value
        });
    };
    const handleGoBack = () => {
        history.push('/users/')
    }
    const allFieldsFilled = userData.name && userData.password && userData.email && userData.role
    return (
        <div>
            <Breadcrumb goBack={handleGoBack} path={history.location.pathname}/>
            <form>
                <Title title='Create User'/>
                <label htmlFor='name'>Name
                    <input autoFocus type="text" name="name" onChange={handleFormChange}/>
                </label>
                <label htmlFor='password'>Password
                    <input type="password" name="password" onChange={handleFormChange}/>
                </label>
                <label htmlFor='email'>Email
                    <input type="email" name="email" onChange={handleFormChange}/>
                </label>
                <label htmlFor='role'>Role
                    <select name="role" onChange={handleFormChange}>
                        <option value="reader">Reader</option>
                        <option value="writer">Writer</option>
                        <option value="creator">Creator</option>
                    </select>
                </label>
                <label>
                    Send email to user
                    <input type="checkbox" name="sendEmailToUser" onChange={handleFormChange}/>
                </label>

                <BtnPrimary onClick={handleCreate}
                            disabled={loading || !allFieldsFilled}>{loading ? 'Wait please' : 'Create'}</BtnPrimary>
                <CancelButton onClick={handleGoBack} disabled={loading}/>
            </form>
        </div>
    )
}

export default UserCreationForm
