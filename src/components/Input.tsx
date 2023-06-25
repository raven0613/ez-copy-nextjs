import { useRef, useState } from 'react';
import styles from '../styles/input.module.scss'

interface IInput {
    value: string
    placeholder: string;
    handleChange: (keyword: string) => void;
}

export default function Input({ value, placeholder, handleChange }: IInput) {
    const ref = useRef<HTMLInputElement>(null);
    // console.log(ref.current?.offsetWidth)
    return (
        <>
            <input
                onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                }}
                ref={ref}
                onChange={e => {
                    e.preventDefault();
                    e.stopPropagation();
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