import { getDay } from "date-fns";
import { useState } from "react";
import { format } from 'date-fns'; // Importe a função format do date-fns

import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export function InputText({
  label,
  value,
  id
}: {
  label?: string
  value?: string
  id?: string
}) {
  return (
    <div className="relative z-0">
      <input type="text" id={id} className="block w-full px-0 py-2 text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " value={value} />
      <label htmlFor={id} className="bg-white absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">{label}</label>
    </div>
  )
}


export function InputTextForms({
  label,
  value,
  id,
  onChange
}: {
  label?: string;
  value?: string | number | null;
  id?: string;
  onChange: (e?: any) => void;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        id={id}
        className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        onChange={(e) => onChange(e)}
        value={value ? value : ''}
      />
      <label htmlFor="small_outlined" className="bg-white absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1">{label}</label>
    </div>
  )
}

type Option = {
  value?: string;
  label?: string;
};

type InputSelectProps = {
  label: string;
  options?: Option[];
  id?: string;
  onChange?: (value: string) => void;
  value?: number | string | null | undefined;
};

export function InputSelect({ label, options = [], id, onChange }: InputSelectProps) {
  const [selectedValue, setSelectedValue] = useState<string>('');

  const handleOnChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedValue(event.target.value);
    if (onChange) {
      onChange(event.target.value); // Chama o callback para enviar o valor selecionado ao componente pai
    }
  };

  return (
    <div className="relative">
      <select
        id={id}
        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        onChange={handleOnChange} // Adiciona o evento onchange
        value={selectedValue} // Define o valor selecionado
      >
        {options
          ? options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))
          : null}
      </select>
      <label
        htmlFor={id}
        className="bg-white absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
      >
        {label}
      </label>
    </div>
  );
}

export function InputTextArea({
  id,
  value,
  label,
  onChange
}: {
  id?: string
  label?: string
  value?: any;
  onChange: (e?: any) => void;
}) {
  return (
    <div className="relative">
      <label htmlFor={id} className="block mb-2 text-sm font-medium text-gray-900">{label}</label>
      <textarea id={id} onChange={(e) => onChange(e)} rows={4} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500" placeholder={value}></textarea>
    </div>
  )
}

export function InputCalendarForm({
  label,
  value,
  id,
  onChange
}: {
  label?: string;
  value?: string | number | null;
  id?: string;
  onChange: (value: string) => void;
}) {
  const [startDate, setStartDate] = useState(new Date());

  const handleDateChange = (date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    setStartDate(date);
    onChange(formattedDate);
  };

  return (
    <div className="relative">
      <DatePicker
        id={id}
        selected={startDate}
        onChange={handleDateChange}
        className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        dateFormat="dd/MM/yyyy"
        enableTabLoop
        strictParsing
        useWeekdaysShort
      />
      <label
        htmlFor={id}
        className="bg-white absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
      >
        {label}
      </label>
    </div>
  );

}

export function InputTimeForm({
  label,
  value,
  id,
  onChange
}: {
  label?: string;
  value?: string | null;
  id?: string;
  onChange: (value: any) => void;
}) {
  const [selectedTime, setSelectedTime] = useState(value || '');

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setSelectedTime(inputValue);
    onChange(inputValue);
  };

  return (
    <div className="relative">
      <input
        type="time"
        id={id}
        value={selectedTime}
        onChange={handleTimeChange}
        className="block px-2.5 pb-1.5 pt-3 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      />
      <label
        htmlFor={id}
        className="bg-white absolute text-sm text-gray-500 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white peer-focus:px-2 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 left-1"
      >
        {label}
      </label>
    </div>
  );
}