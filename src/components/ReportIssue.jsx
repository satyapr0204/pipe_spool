import React from 'react'
import { useSelector } from 'react-redux';

const ReportIssue = ({ issueReason }) => {
    const background = useSelector((state) => state.entity.primaryColor);
    return (
        <>
            <div className="modal fade other-popup" id="reported-issue-popup" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <i className="hgi hgi-stroke hgi-cancel-01"></i>
                        </button>
                        <div className="modal-body">
                            <div className="other-popup-in">
                                <div className="other-popup-icon" style={{
                                    background: background,
                                    color:'white'
                                }}>
                                    <i className="hgi hgi-stroke hgi-flag-03"></i>
                                </div>
                                <div className="other-popup-data mb-0">
                                    <h1>Reported Issue</h1>
                                    <form action="">
                                        <textarea
                                            value={issueReason}
                                            readOnly></textarea>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default ReportIssue
