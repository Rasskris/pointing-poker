import React, { useState, ChangeEventHandler } from 'react';
import classes from './Input.module.scss';
import { IClasses } from '../../interfaces/IClasses';
import _uniqueId from 'lodash/uniqueId';
import { InputLayoutTypes } from '../../interfaces/InputLayoutTypes';

interface IPropsInput {
  layout: string;
  type: string;
  label: string;
  value: string;
  touched?: boolean;
  validate?: boolean;
  shouldValidate?: boolean;
  onChangeInputHandler: ChangeEventHandler;
  checked?: boolean;
  messageError?: string;
}

const Input: React.FC<IPropsInput> = ({
  type,
  layout,
  value,
  onChangeInputHandler,
  label,
  validate,
  touched,
  messageError,
}) => {
  const inputType: string = type;
  const [uniqueId] = useState(_uniqueId(label));
  const incomingClasses: IClasses = { ...classes };
  const inputLayout: string = layout === InputLayoutTypes.row ? incomingClasses.row : incomingClasses.column;
  const inputClasses: string[] = [inputLayout];

  if (validate && touched) {
    inputClasses.push(classes.valid);
  }

  if (!validate && touched) {
    inputClasses.push(classes.invalid);
  }

  return (
    <div className={inputClasses.join(' ')}>
      <label className={classes.label} htmlFor={uniqueId}>
        {label}
      </label>
      <input className={classes.input} type={inputType} id={uniqueId} value={value} onChange={onChangeInputHandler} />
      {messageError && !validate && touched ? <span className={classes.error}>{messageError}</span> : null}
    </div>
  );
};

export { Input };
