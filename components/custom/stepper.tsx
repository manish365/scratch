import React from 'react'
interface PropType {
  title: string;
  subTitle: string;
  disabled?: boolean;
}

function Stepper({ title, subTitle, disabled = false }: PropType) {
  const commonClasses = `flex flex-col gap-2 px-4 py-3 border`;
  let compiledClasses = disabled
    ? `${commonClasses} cursor-not-allowed text-gray bg-slate-300`
    : `${commonClasses} cursor-pointer text-black bg-slate-400`;
  return (
    <div className={compiledClasses}>
      <h4 className='uppercase'>{title}</h4>
      <span>{subTitle}</span>
    </div>
  );
}

export default Stepper
