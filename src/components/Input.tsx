import { useState } from 'react';
import styles from '../styles/input.module.scss'

interface IInput {
    value: string
    placeholder: string;
    handleChange: (keyword: string) => void;
}

export default function Input({ value, placeholder, handleChange }: IInput) {
    return (
        <>
            <input
                onChange={e => {
                    handleChange(e.target.value);
                }}
                placeholder={placeholder}
                className={styles.input}
                value={value}
                type="text"
            />
        </>
    )
}