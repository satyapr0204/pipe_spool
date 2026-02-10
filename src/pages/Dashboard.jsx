import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import Pagination from "../commanComponents/Pagination";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const navigate = useNavigate();
  const itemsPerPage = 10;
  const projectData = useSelector((state) => state?.entity?.project);
  const background = useSelector((state) => state.entity.primaryColor);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    setProjects(projectData);
  }, [projectData]);

  const [currentPage, setCurrentPage] = useState(1);

  const [search, setSearch] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  console.log(filteredProjects);

  // useEffect(() => {
  //   const time=setTimeout=(()=>{

  //   },500)
  //   return ()=>clearTimeout(time)
  // }, [projects])

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
  };

  useEffect(() => {
    const token = Cookies.get("pipeSpool");
    if (token) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (!search.trim() || search.trim().length < 2) {
      setFilteredProjects(projects);
      return;
    }

    const handler = setTimeout(() => {
      const filter = projects.filter((item) =>
        item?.project_name?.toLowerCase().includes(search.toLowerCase()),
      );
      setFilteredProjects(filter);
    }, 500);

    return () => clearTimeout(handler);
  }, [search, projects]);

  console.log(projects);
  const totalItems = filteredProjects?.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProjects?.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <>
      <div class="page-wrapper">
        <Header />

        <main className="projects-page">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="page-heading">
                  <h1>
                    {projects?.[0]?.entity?.entity_name || "FabricationTech"}
                  </h1>
                  <p>Select a project to view spools.</p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="page-search">
                  {/* <input
                  type="text"
                  value={search}
                  onChange={()=>setSearch(e.target.value)}
                  placeholder="Search by project name…"
                  className="srch-field"
                /> */}

                  <input
                    type="text"
                    value={search}
                    onChange={handleSearch}
                    placeholder="Search by project name…"
                    className="srch-field"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="grid-wrap">
              <div className="row">
                {currentItems?.length > 0 ? (
                  currentItems.map((item) => (
                    <div className="col-lg-4 col-md-6" key={item.id}>
                      <div className="project-item">
                        <h4>
                          <i
                            className="hgi hgi-stroke hgi-folder-02"
                            style={{ color: background }}
                          ></i>
                          {item.project_name}
                        </h4>
                        <div className="btm">
                          <p>
                            Total Spools <b>{item.spools_count}</b>
                          </p>
                          <Link
                            to="/spool"
                            state={{ id: item?.id }}
                            className="primary-cta"
                          >
                            Open{" "}
                            <i className="fa-light fa-arrow-right-long"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <span className="d-block text-center mt-5">
                    No projects found
                  </span>
                )}
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <Pagination
                    currentPage={currentPage}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                    showResult={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
