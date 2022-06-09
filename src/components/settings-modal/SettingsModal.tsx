import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment, MouseEventHandler } from "react";
import { TOGGLE_SETTINGS } from "src/lib/store/slices/editor";
import { useTypedDispatch, useTypedSelector } from "src/lib/store/store";
import SettingsTabs from "./SettingsTabs";

interface SettingsModalProps {}

const SettingsModal: React.FC<SettingsModalProps> = () => {
  const isOpen = useTypedSelector((s) => s.editor.isSettingsOpen);

  const dispatch = useTypedDispatch();

  const onClose = () => {
    dispatch(TOGGLE_SETTINGS(false));
  };

  return (
    <>
      <Transition show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-lg transform  rounded-2xl bg-dark-700 p-5 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium my-0 text-gray-200"
                  >
                    App Settings
                  </Dialog.Title>

                  <SettingsTabs />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default SettingsModal;
