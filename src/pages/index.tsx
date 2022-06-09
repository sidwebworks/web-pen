import { Popover } from "@headlessui/react";
import {
  BeakerIcon,
  CodeIcon,
  SearchIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import useFuseSearch from "@hooks/use-fuse";
import { Directory } from "@typings/editor";
import { isFile } from "@typings/guards";
import { ProjectTypes } from "@typings/projects";
import { format } from "date-fns";
import { debounce } from "lodash-es";
import type { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEventHandler, useEffect, useMemo, useRef } from "react";
import { useTypedDispatch, useTypedSelector } from "src/lib/store/store";
import {
  CREATE_PROJECT,
  DELETE_PROJECT,
  LOAD_PROJECTS,
} from "src/lib/store/thunks";

const Home: NextPage = () => {
  const query = useRef("");
  const dispatch = useTypedDispatch();
  const projects = useTypedSelector((s) => Object.values(s.projects.items));

  const { handleChange, state } = useFuseSearch(projects, {
    shouldSort: true,
    keys: ["name", , "children.mimeType", "createdAt", "id"],
  });

  useEffect(() => {
    dispatch(LOAD_PROJECTS());
  }, []);

  const onSearch: ChangeEventHandler<HTMLInputElement> = debounce((ev) => {
    query.current = ev.target.value;
    handleChange(ev.target.value);
  }, 180);

  return (
    <>
      <div className="min-h-full h-full">
        <Popover as="header" className="pb-24  bg-dark-900">
          {() => (
            <>
              <div className="max-w-3xl mx-auto px-5 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="relative py-10 lg:py-4 flex items-center justify-center lg:justify-between">
                  {/* Logo */}
                  <div className="absolute bg-gradient-to-br  leading-none text-3xl text-transparent from-cyan-400 to-green-400 font-bold bg-clip-text left-0 flex-shrink-0 lg:static">
                    <a href="#">
                      <span className="sr-only">Web pen</span>
                      Web Pen
                    </a>
                  </div>
                  {/* Right section on desktop */}
                  <div className="hidden lg:ml-4 lg:flex lg:items-center lg:pr-0.5">
                    <Link passHref href={"https://sidwebworks.com"}>
                      <a
                        className="flex-shrink-0 p-1 
                        rounded-full text-opacity-100 flex items-center hover:scale-120 transform text-cyan-400 transition focusable"
                      >
                        <BeakerIcon className="h-6 w-6" aria-hidden="true" />
                        <span className="sr-only">Developer contact</span>
                      </a>
                    </Link>
                  </div>
                </div>
                <div className="w-full lg:block border-t border-true-gray-700 border-opacity-50 py-5">
                  <div className="grid grid-cols-1 gap-8 items-center">
                    <div>
                      <div className="w-full mx-auto">
                        <label htmlFor="mobile-search" className="sr-only">
                          Search local projects
                        </label>
                        <div className="relative text-cyan-400">
                          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                            <SearchIcon
                              className="h-5 w-5"
                              aria-hidden="true"
                            />
                          </div>
                          <input
                            onChange={onSearch}
                            className="block w-full bg-dark-800 bg-opacity-95 py-2 pl-10 pr-3 border border-transparent rounded-md leading-5 text-true-gray-500 placeholder-true-gray-600 focus:outline-none focusable focus-visible:ring-1 focus:border-transparent   focus:placeholder-cyan-400 focus:ring-opacity-30  sm:text-sm"
                            placeholder="Search local projects"
                            type="search"
                            autoComplete="off"
                            name="search"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </Popover>
        <main className="-mt-24 pb-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
            <h1 className="sr-only">Page title</h1>
            {/* Main 3 column grid */}
            <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3  min-h-80 lg:gap-8">
              {/* Left column */}
              <div className="grid grid-cols-1 gap-4 lg:col-span-2 h-full bg-dark-700 rounded-lg overflow-hidden shadow-xl">
                <section aria-labelledby="section-1-title">
                  <h2 className="sr-only" id="section-1-title">
                    All Projects
                  </h2>
                  <div className="rounded-lg overflow-hidden">
                    <div className="gap-y-3 p-2 grid">
                      {(query.current.trim() ? state : projects).map((p) => (
                        <ProjectCard project={p} key={p.id} />
                      ))}

                      {projects.length < 1 ? (
                        <p className="text-center py-5 text-2xl text-true-gray-500">
                          No projects created
                        </p>
                      ) : null}
                    </div>
                  </div>
                </section>
              </div>

              {/* Right column */}
              <div className="grid grid-cols-1 gap-4 h-full bg-dark-700 rounded-lg overflow-hidden shadow-xl">
                <section aria-labelledby="section-2-title">
                  <h2 className="sr-only" id="section-2-title">
                    Select a project template
                  </h2>
                  <div className="rounded-lg overflow-hidden shadow">
                    <div className="gap-y-3 p-2 grid">
                      <TemplateCard
                        type={ProjectTypes.VanillaJavascript}
                        img="/icons/javascript.svg"
                        title="Vanilla Javascript"
                      />
                      <TemplateCard
                        type={ProjectTypes.VanillaTypescript}
                        img="/icons/typescript.svg"
                        title="Vanilla Typescript"
                      />
                      <TemplateCard
                        type={ProjectTypes.ReactJavascript}
                        img="/icons/react.svg"
                        title="React Javascript"
                      />
                      <TemplateCard
                        type={ProjectTypes.ReactTypescript}
                        img="/icons/react_ts.svg"
                        title="React Typescript"
                      />
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </main>
        <footer>
          <div className="max-w-3xl mt-2 mx-auto px-4 sm:px-6 lg:px-8 lg:max-w-7xl">
            <div className="border-t border-true-gray-800 py-6 text-sm text-true-gray-600 text-center sm:text-left">
              <span className="block sm:inline">
                &copy; 2022 Sidwebworks -{" "}
              </span>{" "}
              <span className="block sm:inline">
                Don't worry I don't want your data :)
              </span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

const ProjectCard = ({ project }: { project: Directory }) => {
  const dispatch = useTypedDispatch();

  const handleDelete = () => {
    dispatch(DELETE_PROJECT(project.id));
  };

  const composition = useMemo(() => {
    return project.children.reduce((acc, curr) => {
      if (!isFile(curr)) return acc;
      const type = curr.mimeType.split("/")[1];

      if (type) {
        acc[type] = typeof acc[type] === "number" ? acc[type]++ : 1;
      }
      return acc;
    }, {});
  }, [project.children]);

  return (
    <div className="w-full p-4 bg-dark-400 rounded-lg flex items-center justify-start gap-3">
      <div className="grid grid-cols-2 gap-2 mr-auto">
        <p className="text-xl -mt-1 text-cyan-400">{project.name}</p>
        <p className=" text-true-gray-500 text-sm mt-1 mr-auto">
          {format(new Date(project.createdAt), "EEEE dd MMMM yyyy tttt")}
        </p>

        <div className="flex mt-1 items-center gap-2">
          {Object.keys(composition).map((lang) => (
            <Image
              layout="fixed"
              width={25}
              height={25}
              src={`/icons/${lang}.svg`}
              alt={lang}
            />
          ))}
        </div>
      </div>
      <Link passHref href={`/editor/${project.id}`}>
        <a>
          <CodeIcon className="w-6 h-6 text-cyan-400" />
        </a>
      </Link>

      <button onClick={handleDelete}>
        <TrashIcon className="w-6 h-6 text-red-500" />
      </button>
    </div>
  );
};

const TemplateCard = ({
  title,
  img,
  type,
}: {
  title: string;
  type: ProjectTypes;
  img: string;
}) => {
  const dispatch = useTypedDispatch();
  const router = useRouter();

  const handleClick = async () => {
    const id = await dispatch(CREATE_PROJECT(type)).unwrap();
    router.push(`/editor/${id}`);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full p-3 bg-dark-400 hover:bg-dark-500 transition active:scale-95 transform rounded-lg flex items-center justify-start gap-3"
    >
      <Image layout="fixed" width={50} height={50} src={img} alt={title} />
      <span className="text-lg text-true-gray-400">{title}</span>
    </button>
  );
};

export default Home;
