import React, { useEffect, useState } from "react";
import { spoolData } from "../assets/data.json";
import Header from "../components/Header";
import { Link, useNavigate } from "react-router-dom";
import ReportIssue from "../components/ReportIssue";
import ViewStageModal from "../components/ViewStageModal";
import Pagination from "../commanComponents/Pagination";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { spoolByProject } from "../redux/slice/projectSlice";

const Spool = () => {
  const [pId, setPid] = useState(null)
  const { state } = useLocation();
  const navigate = useNavigate()
  const [spools, setSpools] = useState([]);
  const [filteredSpools, setFilteredSpools] = useState([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [flagText, setFlagText] = useState(null);
  const [selectStatus, setSelectStatus] = useState("");
  const [selectStage, setSelectStage] = useState("");
  const [isflagged, setIsFlagged] = useState(false);
  const [projectName, setProjectName] = useState(null);
  const [selectSpool, setSelectSpool] = useState(null)
  const { projectsData } = useSelector((state) => state.project);
  const background = useSelector((state) => state.entity.primaryColor);
  const stages = [...new Set(spools?.map(spool => spool?.stage_name))];
  const dispatch = useDispatch()
  const itemsPerPage = 10;

  useEffect(() => {
    if (state?.id) {
      setPid(state.id);
    }
  }, [state]);

  useEffect(() => {
    if (pId) {
      dispatch(spoolByProject({ project_id: pId }))
    }
  }, [pId])

  useEffect(() => {
    if (projectsData) {
      setSpools(projectsData?.spools || []);
      setProjectName(projectsData?.project_name || null)
    }
  }, [projectsData])

  const status = [
    "ready_to_start",
    "paused",
    "in_progress",
    "complete"
  ]

  // const stages = [
  //   "Fit-up",
  //   "Welding",
  //   "Inspection",
  //   "Coating",
  //   "Cutting"
  // ]

  useEffect(() => {
    const spoolsData = Array.isArray(spools) ? spools : [];
    let filtered = [...spoolsData];
    if (selectStage) {
      const term = selectStage.toLowerCase();
      filtered = filtered.filter(item =>
        item?.stage_name?.toLowerCase().includes(term)
      );
    }
    if (selectStatus) {
      const term = selectStatus.toLowerCase();
      filtered = filtered.filter(item =>
        item?.status?.toLowerCase().includes(term)
      );
    }
    if (isflagged) {
      filtered = filtered.filter(item =>
        item?.flag_status !== null
      );
    }
    setFilteredSpools(filtered);
    setCurrentPage(1)
  }, [spools, selectStage, selectStatus, isflagged]);

  const formatStatus = (value) =>
    value
      .replace(/_/g, " ")
      .replace(/\b\w/g, char => char.toUpperCase());

  const handleToggle = (e) => {
    setIsFlagged(e.target.checked);
  };

  const handleSelectSpool = (id) => {
    setSelectSpool(id)
  }


  const totalItems = filteredSpools?.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredSpools.slice(startIndex, startIndex + itemsPerPage);


  return (
    <>
      <div className="page-wrapper">
        <Header />
        <main className="spools-page">
          <div className="container">
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <div className="page-heading">
                  <h1>{projectName}</h1>
                  <p>Select a spool to view stages.</p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6">
                <div className="page-search">
                  <Link onClick={() => navigate(-1)} className="back-cta">
                    <img src="/images/projects/arrow-left.svg" alt="" /> Back to
                    Projects
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="spools-table">
              <div className="spools-head">
                <h1>
                  <i className="hgi hgi-stroke hgi-file-01" style={{
                    color: background
                  }}></i>
                  Spools
                  in {projectName}
                </h1>
                <div className="spools-filter">
                  <form action="">
                    <label>
                      <i className="hgi hgi-stroke hgi-filter"></i> Filters:
                    </label>
                    <select
                      value={selectStatus}
                      onChange={(e) => setSelectStatus(e.target.value)}
                    >
                      <option value="">Status</option>

                      {status.map((item, index) => (
                        <option key={index} value={item}>
                          {formatStatus(item)}
                        </option>
                      ))}
                    </select>


                    <select
                      value={selectStage}
                      onChange={(e) => setSelectStage(e.target.value)}
                    >
                      <option value="">Stages</option>

                      {stages.map((item, index) => (
                        <option key={index} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>

                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckChecked"
                        checked={isflagged}
                        onChange={handleToggle}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckChecked"
                      >
                        Show Flagged Only
                      </label>
                    </div>
                  </form>
                </div>
              </div>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Spool Number</th>
                      <th>Current Stage</th>
                      <th>Status</th>
                      <th>Flagged</th>
                      <th>Issue Notes</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>

                    {currentItems?.length > 0 ? (
                      currentItems?.map((item) => (
                        <tr key={item?.id}>
                          <td>
                            <div className="spool-tag" style={{
                              background: background
                            }}>
                              {item?.spool_number || "SP-2024-001"}
                            </div>
                          </td>
                          <td>{item?.stage_name || "Welding"}</td>
                          <td>
                            {item?.status === "ready_to_start" && (
                              <div className="status-tag start">
                                <i className="hgi hgi-stroke hgi-play"></i>
                                Ready to Start
                              </div>
                            )}

                            {item?.status === "paused" && (
                              <div className="status-tag paused">
                                <i className="hgi hgi-stroke hgi-pause"></i>
                                Paused
                              </div>
                            )}

                            {item?.status === "in_progress" && (
                              <div className="status-tag inprogress">
                                <i className="hgi hgi-stroke hgi-refresh"></i>
                                In Progress
                              </div>
                            )}

                            {item?.status === "complete" && (
                              <div className="status-tag completed">
                                <i className="hgi hgi-stroke hgi-checkmark-circle-01"></i>
                                Completed
                              </div>
                            )}
                          </td>
                          <td>
                            {item?.flag_status !== null ? (
                              <div className="status-tag flagged">
                                <i className="hgi hgi-stroke hgi-flag-02"></i>
                                Flagged
                              </div>
                            ) : (
                              <span>-</span>
                            )}
                          </td>
                          <td>
                            {item?.flag_reason !== null ? (
                              <a
                                type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#reported-issue-popup"
                                className="view-btn"
                                onClick={() => setFlagText(item?.flag_reason)}
                              >
                                View
                              </a>
                            ) : (
                              <span>-</span>
                            )}
                          </td>
                          <td>
                            <div className="action-grp">
                              <button
                                type="button"
                                className="non-primary-cta"
                                data-bs-toggle="modal"
                                data-bs-target="#view-stages-popup"
                                onClick={() => handleSelectSpool(item?.spool_id)}
                                style={{
                                  background: background,
                                  borderColor: background
                                }}
                              >
                                View Stages
                              </button>
                              <Link
                                to="/drawing-spool"
                                state={{
                                  spool_id: item?.spool_id,
                                  stage_id: item?.stage_id
                                }}
                                className="primary-cta"
                              >
                                Open
                              </Link>
                            </div>
                          </td>
                        </tr>
                      ))) : (
                      <tr>
                        <td colSpan={6} style={{ textAlign: "center", padding: "20px" }}>
                          No spools found .
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <Pagination
              currentPage={currentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              showResult={true}
            />
          </div>
        </main>
      </div>

      <ReportIssue
        issueReason={flagText}
      />
      <ViewStageModal
        initialId={selectSpool}

      />
    </>
  );
};

export default Spool;
