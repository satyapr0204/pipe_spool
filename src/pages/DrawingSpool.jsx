import React, { useEffect, useRef, useState } from 'react'
import Header from '../components/Header'
import IssueInfoPopup from '../components/IssueInfoPopup'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import StartPopup from '../components/StartPopup'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSpoolsDrawing } from '../redux/slice/spoolSlice'
import { pauseAndResumeTask, reportTask, startAndComplateTask } from '../redux/slice/taskSlice'
import { toast } from 'react-toastify'
const imagebaseUrl = import.meta.env.VITE_IMAGE_URL;

const getActionFromBarcode = (code) => {
    if (!code) return null;

    return code.split("|").pop().split("-").pop();
};

const STATUS_CONFIG = {
    ready_to_start: {
        className: "start",
        icon: "hgi-play",
        label: "Ready to Start",
    },
    paused: {
        className: "paused",
        icon: "hgi-pause",
        label: "Paused",
    },
    in_progress: {
        className: "inprogress",
        icon: "hgi-refresh",
        label: "In Progress",
    },
    completed: {
        className: "completed",
        icon: "hgi-checkmark-circle-01",
        label: "Completed",
    },
};

const DrawingSpool = () => {
    const navigate = useNavigate()
    const location = useLocation();
    const { stage_id, spool_id } = location?.state || {};
    const startTime = useRef(0);
    const scannerInputRef = useRef(null);
    const { state } = useLocation();
    const dispatch = useDispatch();
    const { spoolDrawingDetails } = useSelector((state) => state.spools)
    const [them, setThem] = useState('')
    const selected = useSelector((state) => state.entity.selected);
    useEffect(() => {
        const themColor = JSON.parse(localStorage.getItem('selectedEntity'));
        setThem(themColor?.entity_secondary_color)
        // console.log("them", them?.entity_primary_color)
    }, [selected]);
    const background = them;
    // const background = useSelector((state) => state.entity.primaryColor);
    const [showReportIssue, setShowReportIssue] = useState(false)
    const [spoolId, setSpoolId] = useState(null || spool_id)
    const [stageId, setStageId] = useState(null || stage_id);
    const [spoolDetails, setSpoolDetails] = useState(null);
    const [type, setType] = useState(null)
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;
            setIsTablet(width >= 800 && width <= 1334);
        };
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const onScan = async (eventCall) => {
        try {
            const entity_id = JSON.parse(localStorage.getItem('selectedEntity'))?.id
            const project_id = spoolDetails?.project?.id
            const spool_id = spoolId
            const stage_id = stageId
            if (spoolDetails?.flag_status === 'open') {
                toast.error('Your flag has opend please wait whaile flag closed by admin!');
                return;
            }
            if (eventCall === 'START' || eventCall === 'END') {
                if (eventCall === 'START') {
                    if (currentStatus === 'ready_to_start') {
                        await dispatch(startAndComplateTask({
                            entity_id: entity_id,
                            project_id: project_id,
                            spool_id: spool_id,
                            stage_id: stage_id,
                            action_type: 'start'
                        }))
                    } else {
                        toast.error('You need to go in the ready to start start!')
                    }
                }
                else {
                    if (currentStatus === 'in_progress') {
                        await dispatch(startAndComplateTask({
                            entity_id: entity_id,
                            project_id: project_id,
                            spool_id: spool_id,
                            stage_id: stage_id,
                            action_type: 'complete'
                        }))
                    } else {
                        toast.error('Your task is not in progress!')
                    }
                }
                await dispatch(fetchSpoolsDrawing({ spool_id: spoolId, stage_id: stageId }));
            } else if (eventCall === 'PAUSE' || eventCall === 'RESUME') {
                if (eventCall === 'PAUSE') {
                    if (currentStatus === 'in_progress' && currentStatus !== 'ready_to_start') {
                        const pauseData = await dispatch(pauseAndResumeTask({
                            entity_id: entity_id,
                            project_id: project_id,
                            spool_id: spool_id,
                            stage_id: stage_id,
                            action_type: 'pause'
                        }));
                        console.log("pauseData", pauseData?.payload?.data?.id)
                        if (pauseData?.payload?.success) {
                            localStorage.setItem('project_assign_id', pauseData?.payload?.data?.id)
                        }
                    } else {
                        toast.error('Your task is not in progress!')
                    }
                } else {
                    if (currentStatus === 'paused') {
                        await dispatch(pauseAndResumeTask({
                            entity_id: entity_id,
                            project_id: project_id,
                            spool_id: spool_id,
                            stage_id: stage_id,
                            action_type: 'resume'
                        }))
                    } else {
                        toast.error('Your task is already in progress!')
                    }
                }
                await dispatch(fetchSpoolsDrawing({ spool_id: spoolId, stage_id: stageId }));

            } else {
                console.log("You have a wronge event call")
            }
        } catch (error) {
            console.log("Error message when call a event", error)
        }
    }

    useEffect(() => {
        const inputEl = scannerInputRef.current;
        if (!inputEl) return;
        const handleWindowFocus = () => inputEl.focus();
        window.addEventListener("focus", handleWindowFocus);
        return () => {
            window.removeEventListener("focus", handleWindowFocus);
        };
    }, []);

    useEffect(() => {
        if (state?.spool_id && state?.stage_id) {
            setSpoolId(state?.spool_id);
            setStageId(state?.stage_id);
        }
    }, [state]);

    useEffect(() => {
        if (spoolId && stageId) {
            dispatch(fetchSpoolsDrawing({ spool_id: spoolId, stage_id: stageId }))
        }
    }, [spoolId, stageId])

    useEffect(() => {
        if (spoolDrawingDetails) {
            setSpoolDetails(spoolDrawingDetails)
        }
        if (spoolDrawingDetails?.stage_barcode?.stage_status === 'completed') {
            navigate(-1)
        }
    }, [spoolDrawingDetails])

    const currentStatus =
        spoolDetails?.stage_barcode?.stage_status;

    // useEffect(() => {
    //     const inputEl = scannerInputRef.current;
    //     if (!inputEl) return;

    //     const handleKeyDown = async (e) => {
    //         if (e.key !== "Enter") return;
    //         e.preventDefault();
    //         e.stopPropagation();
    //         const scannedCodeData = e.target.value.trim();
    //         if (!scannedCodeData) return;
    //         const action = getActionFromBarcode(scannedCodeData);
    //         await onScan(action);
    //         e.target.value = "";
    //     };
    //     inputEl.addEventListener("keydown", handleKeyDown);
    //     const handleModalHidden = () => {
    //         inputEl.focus();
    //     };

    //     document.addEventListener("hidden.bs.modal", handleModalHidden);
    //     inputEl.focus();

    //     return () => {
    //         inputEl.removeEventListener("keydown", handleKeyDown);
    //         document.removeEventListener("hidden.bs.modal", handleModalHidden);
    //     };
    // }, [onScan]);

    useEffect(() => {
        const inputEl = scannerInputRef.current;
        if (!inputEl) return;

        const handleKeyDown = async (e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            e.stopPropagation();

            const scannedCodeData = e.target.value.trim();
            if (!scannedCodeData) return;

            const action = getActionFromBarcode(scannedCodeData);
            await onScan(action);

            e.target.value = "";
        };

        // const handleBlur = () => {
        //     setTimeout(() => {
        //         inputEl.focus();
        //     }, 0);
        // };
        const handleBlur = () => {
            setTimeout(() => {
                const modalOpen = document.querySelector(".modal.show");
                if (modalOpen) return; // popup is open, don’t focus scanner
                inputEl.focus();
            }, 0);
        };

        inputEl.addEventListener("keydown", handleKeyDown);
        inputEl.addEventListener("blur", handleBlur);
        const handleModalHidden = () => {
            inputEl.focus();
        };
        document.addEventListener("hidden.bs.modal", handleModalHidden);

        // Initial focus
        inputEl.focus();

        return () => {
            inputEl.removeEventListener("keydown", handleKeyDown);
            inputEl.removeEventListener("blur", handleBlur);
            document.removeEventListener("hidden.bs.modal", handleModalHidden);
        };
    }, [onScan]);

    // useEffect(() => {
    //     const handleUnload = () => {
    //         sendPauseBeacon();
    //     };

    //     window.addEventListener("pagehide", handleUnload);
    //     window.addEventListener("beforeunload", handleUnload);

    //     return () => {
    //         window.removeEventListener("pagehide", handleUnload);
    //         window.removeEventListener("beforeunload", handleUnload);
    //     };
    // }, []);

    // const handlePauseTask = async () => {
    //     if (currentStatus !== "in_progress") return;
    //     const entity_id = JSON.parse(localStorage.getItem("selectedEntity"))?.id;
    //     const project_id = spoolDetails?.project?.id;

    //     try {
    //         await dispatch(
    //             pauseAndResumeTask({
    //                 entity_id,
    //                 project_id,
    //                 spool_id: spoolId,
    //                 stage_id: stageId,
    //                 action_type: "pause",
    //             })
    //         );
    //         await dispatch(fetchSpoolsDrawing({ spool_id: spoolId, stage_id: stageId }));
    //     } catch (err) {
    //         console.log("Auto pause failed", err);
    //     }
    // };

    // const sendPauseBeacon = async () => {
    //     if (currentStatus !== "in_progress") return;
    //     const entity_id = JSON.parse(localStorage.getItem("selectedEntity"))?.id;
    //     const project_id = spoolDetails?.project?.id;

    //     const payload = {
    //         entity_id,
    //         project_id,
    //         spool_id: spoolId,
    //         stage_id: stageId,
    //         action_type: "pause",
    //     };
    //     console.log("Hello", currentStatus)
    //     // await dispatch(
    //     //     pauseAndResumeTask({
    //     //         entity_id,
    //     //         project_id,
    //     //         spool_id: spoolId,
    //     //         stage_id: stageId,
    //     //         action_type: "pause",
    //     //     })
    //     // );
    //     // await dispatch(fetchSpoolsDrawing({ spool_id: spoolId, stage_id: stageId }));

    //     const blob = new Blob([JSON.stringify(payload)], {
    //         type: "application/json",
    //     });

    //     navigator.sendBeacon("https://pipespool.tgastaging.com/api/pause_or_resume_task", blob);
    // };


    // useEffect(() => {
    //     const handleVisibilityChange = () => {
    //         if (document.visibilityState === "hidden") {
    //             handlePauseTask(); // works
    //         }
    //     };

    //     const handleUnload = () => {
    //         sendPauseBeacon(); // works for close/refresh/back
    //     };

    //     document.addEventListener("visibilitychange", handleVisibilityChange);
    //     window.addEventListener("beforeunload", handleUnload);
    //     window.addEventListener("pagehide", handleUnload);

    //     return () => {
    //         document.removeEventListener("visibilitychange", handleVisibilityChange);
    //         window.removeEventListener("beforeunload", handleUnload);
    //         window.removeEventListener("pagehide", handleUnload);
    //     };
    // }, [currentStatus, spoolId, stageId, spoolDetails]);


    // const handlePauseTask = async () => {
    //     if (currentStatus !== "in_progress") return;

    //     try {
    //         await dispatch(pauseAndResumeTask({
    //             entity_id,
    //             project_id,
    //             spool_id: spoolId,
    //             stage_id: stageId,
    //             action_type: "pause",
    //         }));
    //         await dispatch(fetchSpoolsDrawing({
    //             spool_id: spoolId,
    //             stage_id: stageId,
    //         }));
    //     } catch (err) {
    //         console.log("Auto pause failed", err);
    //     }
    // };


    const handleReportIssueSubmit = async (reason) => {
        if (!reason || reason.trim().length === 0) {
            toast.error("Please enter the issue description")
            return
        }
        const project_assign_id = JSON.parse(localStorage.getItem('project_assign_id'))
        if (currentStatus === 'in_progress' || currentStatus === 'paused' && currentStatus !== 'ready_to_start') {
            await dispatch(reportTask({
                project_assign_id: project_assign_id,
                reason: reason,
            }))
            dispatch(fetchSpoolsDrawing({ spool_id: spoolId, stage_id: stageId }))
            localStorage.removeItem('project_assign_id')
            const modalEl = document.getElementById("reported-issue-popup");
            const modalInstance = window.bootstrap?.Modal.getInstance(modalEl);
            modalInstance?.hide();
        } else {
            toast.error('You need to start a task first!')
        }
    }

    const handlePdfDownload = (pdf) => {
        if (!pdf) return;
        const pdfUrl = `${imagebaseUrl}${pdf}`;
        window.open(pdfUrl, "_blank", "noopener,noreferrer");
    };

    return (
        <>
            <div className="page-wrapper">
                <Header />
                <main className="spools-page">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-md-6">
                                <div className="page-heading">
                                    <h1><i className="hgi hgi-stroke hgi-folder-02" style={{ color: background }}></i> {spoolDetails?.project?.project_name}</h1>
                                </div>
                            </div>
                            <div className="col-lg-6 col-md-6">
                                <div className="page-search">
                                    <Link onClick={() => navigate(-1)} className="back-cta">
                                        <img src="/images/projects/arrow-left.svg" alt="" /> Back to Spools
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="spool-strip-wrp">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-6 col-md-9">
                                    <div className="spool-strip-details">
                                        <p>Spool Number <b>{spoolDetails?.spool_drawing?.spool_number}</b></p>
                                        <p>Current Stage <b>{spoolDetails?.stage_barcode?.stage_name}</b></p>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-3">
                                    <div className="spool-strip-stat-report">
                                        <p>Status:</p>
                                        {STATUS_CONFIG[currentStatus] && (
                                            !isTablet && <div className={`status-tag ${STATUS_CONFIG[currentStatus]?.className}`}>
                                                <i className={`hgi hgi-stroke ${STATUS_CONFIG[currentStatus]?.icon}`}></i>
                                                {STATUS_CONFIG[currentStatus]?.label}
                                            </div>
                                        )}
                                        <button
                                            type="button"
                                            data-bs-toggle={currentStatus === "in_progress" ? undefined : "modal"}
                                            data-bs-target={currentStatus === "in_progress" ? undefined : "#issue-info-popup"}
                                            onClick={() => {
                                                if (currentStatus !== "in_progress") {
                                                    setShowReportIssue(true);
                                                }
                                            }}
                                            disabled={currentStatus === "in_progress"}
                                            className="status-tag"
                                            style={
                                                currentStatus === "in_progress"
                                                    ? {
                                                        backgroundColor: "#ffffff",
                                                        color: "#999999",
                                                        border: "1px solid #e0e0e0",
                                                        cursor: "not-allowed",
                                                        opacity: 0.7,
                                                    }
                                                    : {}
                                            }
                                        >
                                            <i
                                                className="hgi hgi-stroke hgi-alert-01"
                                                style={
                                                    currentStatus === "in_progress"
                                                        ? { color: "#999999" }
                                                        : {}
                                                }
                                            ></i>
                                            {" "}Report Issue
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="drawing-wrp">
                                    {/* <!-- DESKTOP --> */}
                                    <div className="bar-code-wrp">
                                        <input
                                            // id="scannerInput"
                                            ref={scannerInputRef}
                                            autoFocus
                                            style={{ position: "absolute", left: "-1000px", top: "-1000px" }}
                                        />
                                        <div className="bar-code-in">
                                            <p>Scan to Start & Complete</p>
                                            <img src={`${currentStatus === 'ready_to_start' ? imagebaseUrl + spoolDetails?.stage_barcode?.start_barcode : imagebaseUrl + spoolDetails?.stage_barcode?.end_barcode}`} alt="" />
                                        </div>
                                        <div className="bar-code-in" >
                                            <p>Scan to Pause & Resume</p>
                                            <img src={`${currentStatus === 'paused' ? imagebaseUrl + spoolDetails?.spool_drawing?.resume_barcode : imagebaseUrl + spoolDetails?.spool_drawing?.pause_barcode}`} alt="" />
                                        </div>
                                    </div>
                                    {/* <!-- DESKTOP --> */}
                                    {/* <!-- MOBILE-TAB --> */}
                                    <div className="drow-status-cta-wrp">
                                        <div className="drow-status-in">
                                            <p>Status:<b> {STATUS_CONFIG[currentStatus]?.label}</b></p>
                                        </div>
                                        <div className="drow-cta-grp">
                                            {
                                                currentStatus === 'ready_to_start' ? (
                                                    <button type="button" className="btn-1" data-bs-target="#stage-start-popup"
                                                        data-bs-toggle="modal" onClick={() => setType('START')}>
                                                        <div className="start active">
                                                            <i className="hgi hgi-stroke hgi-play"></i>
                                                            Ready to Start
                                                        </div>
                                                    </button>
                                                ) :
                                                    (<button type="button" className="btn-1" data-bs-target="#stage-start-popup"
                                                        data-bs-toggle="modal" onClick={() => setType('END')}>
                                                        <div className="complete active">
                                                            <i className="hgi hgi-stroke hgi-checkmark-circle-01"></i>
                                                            Mark as Complete
                                                        </div>
                                                    </button>)
                                            }
                                            {
                                                currentStatus === 'paused' ? (
                                                    <button type="button" className="btn-2" onClick={() => setType('RESUME')} data-bs-target="#stage-start-popup"
                                                        data-bs-toggle="modal">
                                                        <div className="resume active">
                                                            <i className="hgi hgi-stroke hgi-play"></i>
                                                            Resume
                                                        </div>
                                                    </button>
                                                ) : (
                                                    <button type="button" className="btn-2" onClick={() => setType('PAUSE')} data-bs-target="#stage-start-popup"
                                                        data-bs-toggle="modal">
                                                        <div className="pause active">
                                                            <i className="hgi hgi-stroke hgi-pause"></i>
                                                            Pause
                                                        </div>
                                                    </button>
                                                )
                                            }
                                        </div>
                                    </div>
                                    {/* <!-- MOBILE-TAB --> */}
                                    <div className="drawing-frame" >
                                        <div className="drawing-frame-data" >
                                            <div className="icon" style={{ background: background }} onClick={() => handlePdfDownload(spoolDetails?.spool_drawing?.drawing)}><i className="hgi hgi-stroke hgi-file-01" ></i></div>
                                            <h3>PDF spool drawing would be embedded here</h3>
                                            <p>Drawing remains visible until stage is completed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
            <IssueInfoPopup show={showReportIssue} handleClose={() => setShowReportIssue(false)} onSubmit={handleReportIssueSubmit} />
            <StartPopup type={type} onScan={onScan} />
            {/* <ReportedIssuePopup onSubmit={handleReportIssueSubmit} /> */}
        </>
    )
}

export default React.memo(DrawingSpool)
