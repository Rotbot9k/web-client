import React, {useContext, useState} from 'react'
import useSetTitle from '../../hooks/useSetTitle'
import {IconDark, IconLight, IconPreferences, IconSave} from '../ui/Icons'
import {getAllTimezones} from 'countries-and-timezones';
import secureApiFetch from '../../services/api';
import BtnPrimary from '../ui/buttons/BtnPrimary'
import Title from '../ui/Title';
import ThemeContext from "../../contexts/ThemeContext";
import BtnSecondary from "../ui/buttons/BtnSecondary";
import CancelButton from "../ui/buttons/Cancel";
import Breadcrumb from '../ui/Breadcrumb';
import setThemeColors from '../../utilities/setThemeColors';

const UserPreferences = ({history}) => {
    useSetTitle('Preferences')
    const timezones = getAllTimezones();
    const timezoneKeys = Object.keys(timezones).sort();
    const [timezone, setTimezone] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const {theme, setTheme} = useContext(ThemeContext)

    const handleSwitchTheme = () => {
        setTheme(theme => {
            setThemeColors(theme)
            return (theme === 'light') ? 'dark' : 'light'
        })
    }

    const handleChange = (e) => {
        setTimezone(e.target.value);
    }

    const handleSubmit = () => {
        secureApiFetch(`/users/${user.id}`, {
            method: 'PATCH',
            body: JSON.stringify({timezone: timezone})
        })
            .then(() => {
                user.timezone = timezone;
                localStorage.setItem('user', JSON.stringify(user));
                history.push('/');
            })
            .catch(e => console.error(e))
    }

    return (
        <>
            <div className='heading'>
                <Breadcrumb history={history}/>
            </div>
            <Title type='User' title='Preferences' icon={<IconPreferences/>}/>
            <form onSubmit={e => e.preventDefault()}>
                <label>Timezone
                    <select onChange={handleChange} defaultValue={user.timezone}>
                        {timezoneKeys.map((key, index) =>
                            <option key={index} value={timezones[key].name}>{timezones[key].name}</option>
                        )}
                    </select>
                </label>
                <label>Theme
                    <BtnSecondary onClick={handleSwitchTheme}>
                        {theme === 'light' ?
                            <IconDark/> : <IconLight/>
                        }
                        {theme === 'light' ? 'Dark' : 'Light'}
                    </BtnSecondary>

                </label>
                <BtnPrimary onClick={handleSubmit}><IconSave/> Save</BtnPrimary>
                <CancelButton onClick={() => {
                    history.push("/")
                }}/>
            </form>
        </>
    )
}

export default UserPreferences
