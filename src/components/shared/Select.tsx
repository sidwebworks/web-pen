import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/outline";
import { Selectable } from "@typings/editor";
import clsx from "clsx";
import React, { Fragment } from "react";

interface SelectProps<T> {
  active: Selectable<T>;
  onChange: (item: Selectable<T>) => void;
  data: Selectable<T>[];
}

function Select<T extends any>({ active, data, onChange }: SelectProps<T>) {
  const handleChange = (item: Selectable<T>) => {
    onChange(item);
  };

  return (
    <Listbox value={active} onChange={handleChange}>
      <div className="relative mt-1 w-full max-w-56">
        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-dark-300 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focusable  sm:text-sm">
          <span className="block truncate text-cyan-500">{active?.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon
              className="h-5 w-5 text-true-gray-500"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute px-0 mt-1 max-h-60 w-full overflow-auto rounded-md bg-dark-400 py-1 text-base shadow-lg z-10 focusable sm:text-sm">
            {data.map((item) => (
              <Listbox.Option
                key={item.label}
                className={({ active }) =>
                  clsx(
                    "relative cursor-pointer list-none select-none py-2 pl-10 pr-4 ",
                    active
                      ? "bg-dark-300 transition text-cyan-500"
                      : "text-true-gray-200"
                  )
                }
                value={item}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium text-cyan-500" : "font-normal"
                      }`}
                    >
                      {item?.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-cyan-400">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

export default Select;
