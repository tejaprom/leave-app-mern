import { Modal, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { refreshAccessToken } from "../utils/apiCalls";
import useSessionTimeout from "../hooks/useSessionTimeout";
import { logout, setToken } from "../redux/authSlice";

const SessionHandler = () => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { showPrompt, extendSession } = useSessionTimeout({
        timeout: 20000,         // 30s for testing
        warningTime: 10000,     // show modal 10s before expiry
        onExtend: async () => {
            try {
                const res = await refreshAccessToken();
                const newAccessToken = res.data.token;
                dispatch(setToken(newAccessToken));
            } catch {
                dispatch(logout());
            }
        },
        onLogout: () => dispatch(logout()),
        enabled: isAuthenticated,
    });

    return (
        <Modal open={showPrompt} footer={null} closable={false}>
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "16px",
                textAlign: "center"
            }}>
                <h3>Your session is about to expire. Continue?</h3>
                <div style={{ display: "flex", gap: "16px" }}>
                    <Button type="primary" onClick={extendSession}>
                        Continue Session
                    </Button>
                    <Button danger onClick={() => dispatch(logout())}>
                        Logout
                    </Button>
                </div>
            </div>
        </Modal>

    );
};

export default SessionHandler;
