import useRole from "../../hooks/useRole";
import useCurrentUser from "../../hooks/useCurrentUser";
import useMessRole from "../../hooks/useMessRole";
import Loading from "../../components/Loading/Loading";
import MessSetup from "./Member/MessSetup";
import DevPlaceholder from "../../components/DevPlaceholder/DevPlaceholder";

// ── State matrix ───────────────────────────────────────────────────────────
// global role = "super_admin"              → Super Admin Overview
// global role = "member", hasMess = false  → Mess Setup (Create / Join)
// global role = "member", hasMess = true,
//   messRole = "manager"                   → Manager Dashboard Overview
// global role = "member", hasMess = true,
//   messRole = "member"  (or null)         → Member Dashboard Overview
const DashboardOverview = () => {
    const [role, isRoleLoading] = useRole();
    const { currentUser, isUserLoading } = useCurrentUser();
    const [messRole, isMessRoleLoading] = useMessRole();

    // Wait for all three to resolve — prevents flash of wrong state
    if (isRoleLoading || isUserLoading || isMessRoleLoading) return <Loading />;

    // Super admin — bypass everything else
    if (role === "super_admin") {
        return <DevPlaceholder title="Super Admin Overview" />;
    }

    // Member with no mess → show onboarding
    if (!currentUser?.hasMess) {
        return <MessSetup />;
    }

    // Member who has a mess — branch by mess-level role
    if (messRole === "manager") {
        return <DevPlaceholder title="Manager Dashboard Overview" />;
    }

    // Default: regular member with an active mess
    return <DevPlaceholder title="Member Dashboard Overview" />;
};

export default DashboardOverview;
