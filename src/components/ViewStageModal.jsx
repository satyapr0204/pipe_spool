import React, { useEffect, useState } from 'react'
import { stages } from "../assets/data.json";
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpools } from '../redux/slice/spoolSlice';

const ViewStageModal = ({ initialId }) => {
    const dispatch = useDispatch();
    const { spoolData } = useSelector((state) => state.spools)
    console.log("initialId", initialId)
    console.log("spoolData", spoolData)
    const [allStages, setAllStages] = useState([]);
    const [spools, setSpools] = useState(null)
    console.log(allStages)

    useEffect(() => {
        if (initialId) {
            dispatch(fetchSpools({ spool_id: initialId }))
        }
    }, [initialId]);

    useEffect(() => {
        if (spoolData) {
            setSpools(spoolData?.spool_number)
            setAllStages(spoolData?.spool_stages)
        }
    }, [spoolData])

    return (
        <>
            <div className="modal fade other-popup" id="view-stages-popup" tabindex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <i className="hgi hgi-stroke hgi-cancel-01"></i>
                        </button>
                        <div className="modal-body">
                            <div className="view-stages-popup-in">
                                <h1>{spools}</h1>
                                <p>Stage progress and workflow.</p>
                                <div className="view-stages-popup-in-table">
                                    <div className="table-responsive">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Stage</th>
                                                    <th>Name</th>
                                                    <th>Status</th>
                                                    <th>Current Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {allStages?.map((item, index) => (
                                                    <tr key={item?.id || index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item?.stage_name}</td>
                                                        <td>{item?.status || "Done"}</td>

                                                        <td>
                                                            {item?.current_status === "done" ? (
                                                                <div className="status-tag completed">
                                                                    <i className="hgi hgi-stroke hgi-checkmark-circle-01"></i>
                                                                    {item?.current_status}
                                                                </div>
                                                            ) :
                                                                (<>-</>)
                                                            }
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ViewStageModal
