import Select from "@components/shared/Select";
import Toggle from "@components/shared/Toggle";
import { Tab, Switch } from "@headlessui/react";
import { useEditor } from "@hooks/use-editor";
import clsx from "clsx";
import { useMemo, Suspense } from "react";
import { normalizeThemeName } from "src/lib";
import { UPDATE_OPTIONS } from "src/lib/store/slices/editor";
import { useTypedDispatch, useTypedSelector } from "src/lib/store/store";
import { LOAD_THEME } from "src/lib/store/thunks";

const SettingsTabs: React.FC = () => {
  const headers = useMemo(() => ["Editor", "Document", "Support"], []);
  const options = useTypedSelector((s) => s.editor.options);
  const dispatch = useTypedDispatch();

  const toggleWordWrap = () => {
    dispatch(
      UPDATE_OPTIONS({
        wordWrap: options.wordWrap === "on" ? "off" : "on",
      })
    );
  };

  return (
    <Tab.Group defaultIndex={0}>
      <Tab.List className={"mt-3 w-full flex"}>
        {headers.map((el) => (
          <Tab
            className={({ selected }) =>
              clsx(
                "px-3 py-1 w-full text-sm border-b font-medium",
                selected
                  ? "border-b-cyan-500 text-cyan-500"
                  : "border-dark-400 text-true-gray-500"
              )
            }
            key={el}
          >
            {el}
          </Tab>
        ))}
      </Tab.List>
      <Tab.Panels className={"text-true-gray-400 pt-3"}>
        <Tab.Panel className={"grid grid-cols-2"}>
          <Suspense
            fallback={
              <div className="w-full h-30 col-span-2 rounded-lg bg-dark-300 animate-skeleton" />
            }
          >
            <SettingsToggle
              value={options.wordWrap === "on"}
              label="Enable Word wrap "
              onChange={toggleWordWrap}
            />

            <div className="py-1 border-y-1  col-span-2 flex items-center gap-2 border-dark-600">
              <label className="text-true-gray-400  text-sm">
                {"Editor Theme"}
              </label>
              <ThemePicker />
            </div>
            <div className="py-1 border-y-1  col-span-2 flex items-center gap-2 border-dark-600">
              <label className="text-true-gray-400  text-sm">
                {"Editor Cursor"}
              </label>
              <CursorPicker />
            </div>
          </Suspense>
        </Tab.Panel>
        <Tab.Panel className={"grid grid-cols-2"}>
          <p className="text-sm text-true-gray-500 col-span-2">
            Options for document settings
          </p>
        </Tab.Panel>
        <Tab.Panel className={"grid grid-cols-2"}>
          <p className="text-sm text-true-gray-500 col-span-2">
            This app is still in Beta, I am a single developer working on this.
            <br /> Please be patient 🙂
          </p>
        </Tab.Panel>
      </Tab.Panels>
    </Tab.Group>
  );
};

const ThemePicker: React.FC = () => {
  const themes = useTypedSelector((s) => s.editor.themes);
  const currentTheme = useTypedSelector((s) => s.editor.currentTheme);

  const dispatch = useTypedDispatch();

  const { monaco } = useEditor();

  const handleChange = async (val: { label: string; value: string }) => {
    if (!monaco) return;

    const theme = await dispatch(LOAD_THEME(val)).unwrap();

    const name = normalizeThemeName(val.value);

    monaco.editor.defineTheme(name, theme);
    monaco.editor.setTheme(name);
  };

  return <Select data={themes} onChange={handleChange} active={currentTheme} />;
};

interface SettingsOptionProps {
  onChange: () => void;
  label: string;
  value: any;
}

const SettingsToggle: React.FC<SettingsOptionProps> = ({
  onChange,
  label,
  value,
}) => {
  return (
    <div className="py-1 border-y-1 flex col-span-1 items-center gap-2 border-dark-600">
      <label className="text-true-gray-400  text-sm">{label}</label>
      <Toggle enabled={value} label={label} onChange={onChange} />
    </div>
  );
};

const CursorPicker: React.FC = () => {
  const cursors = [
    { label: "Blink", value: "block" },
    { label: "Block outline", value: "block-outline" },
    { label: "Line", value: "line" },
    { label: "Line thin", value: "line-thin" },
    { label: "Underline", value: "underline" },
    { label: "Underline thin", value: "underline-thin" },
  ];

  const cursorStyle = useTypedSelector((s) => s.editor.options.cursorStyle);
  const dispatch = useTypedDispatch();

  const handleChange = async (val: { label: string; value: string }) => {
    dispatch(UPDATE_OPTIONS({ cursorStyle: val.value }));
  };

  const value = cursors.find((c) => c.value === cursorStyle);

  return <Select data={cursors} onChange={handleChange} active={value} />;
};

export default SettingsTabs;
