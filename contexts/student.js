import { useContext, createContext, useState, useEffect } from 'react';
import { fetchProfile } from '../helpers/backend_helper';

const StudentContext = createContext({});

export function StudentContextProvider(props) {
    const [studentInfo, setStudentInfo] = useState({});

    useEffect(() => {
        getProfile()
    }, [])

    const getProfile = () => {
        fetchProfile().then(({ error, data }) => {
            if (error === false) {
                setStudentInfo({ ...data })
            }
        })
    }

    return (
        <StudentContext.Provider value={{ studentInfo, setStudentInfo }}>
            {props.children}
        </StudentContext.Provider>
    )
}

export const useStudent = () => {
    return useContext(StudentContext);
}