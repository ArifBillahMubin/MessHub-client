import useRole from "../../hooks/useRole";
import useCurrentUser from "../../hooks/useCurrentUser";
import Loading from "../../components/Loading/Loading";
import MessSetup from "./Member/MessSetup";
import DevPlaceholder from "../../components/DevPlaceholder/DevPlaceholder";

const DashboardOverview = () => {
    const [role, isRoleLoading] = useRole();
    const { currentUser, isUserLoading } = useCurrentUser();

    if (isRoleLoading || isUserLoading) return <Loading />;

    // member with no mess show onboarding
    if (role === "member" && !currentUser?.hasMess) {
        return <MessSetup />;
    }

    // member with a mess
    if (role === "member") {
        return <DevPlaceholder title="Member Dashboard Overview" />;
    }

    // manager
    if (role === "manager") {
        return <DevPlaceholder title="Manager Dashboard Overview" />;
    }

    // super_admin
    if (role === "super_admin") {
        return <DevPlaceholder title="Super Admin Overview" />;
    }

    return <DevPlaceholder title="Dashboard Overview" />;
};

export default DashboardOverview;
