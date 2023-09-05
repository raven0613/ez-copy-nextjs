import { useEffect, useRef, useState } from 'react';
import styles from '../styles/colorPicker.module.scss';
import Input from './Input';

export interface IColorPicker {
    unitId?: string;
    labelFor?: string;
    handleGetColor: (color: string) => void;
}

export default function ColorPicker({ labelFor, unitId, handleGetColor }: IColorPicker) {


    return (
        <div className={styles.colorPicker}>
            {!labelFor && <label htmlFor={`${labelFor ? labelFor : `color_${unitId}`}`}></label>}
            <input
                className={styles.colorPicker__input}
                type='color' id={`${labelFor ? labelFor : `color_${unitId}`}`}
                onChange={(e) => {
                    handleGetColor(e.target.value);
                }}
            ></input>
        </div>
    )
}