import React from 'react'
import { type FieldError } from 'react-hook-form';
import cx from 'classnames'

type SimpleInputProps={
    placeholder?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  controler: Object;
  error: FieldError | undefined;
}
const SimpleInput = ({controler,error,placeholder="Saisir"}:SimpleInputProps) => {
  return (
    <div className="form-control w-full">
    {/* <label className="label">
      <span className="label-text">What is your name?</span>
      <span className="label-text-alt">Alt label</span>
    </label> */}
    <input type="text"  placeholder={placeholder}   {...controler} className={cx("input input-bordered w-full",{
        "border-error":error
    })} />
   
  </div>
  )
}

export default SimpleInput