import React, { useEffect, useState, useMemo } from "react";
import { Minus, Plus, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useLanguage } from "@/context/LanguageContext";
import { UserData } from '../../context/interface.types'
import Image from "next/image";

interface TeamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Employee {
  _id: string;
  roleName: string;
  salary: number;
  quantity: number;
  skinnedRolename: string;
}

// Icons now come from /public/employees for consistency

const getRoleIcon = (roleName: string) => {
  const role = roleName.toLowerCase();
  if (role === "dev" || role === "developer")
    return <Image src="/employees/developerIcon.svg" alt="Developer" width={64} height={44} />;
  if (role === "ceo")
    return <Image src="/employees/ceoIcon.svg" alt="CEO" width={72} height={44} />;
  if (role === "sales")
    return <Image src="/employees/salesIcon.svg" alt="Sales" width={64} height={44} />;
  if (role === "designer")
    return <Image src="/employees/designerIcon.svg" alt="Designer" width={64} height={36} />;
  if (role === "qa")
    return <Image src="/employees/qaIcon.svg" alt="QA" width={64} height={36} />;
  if (role === "manager")
    return <Image src="/employees/managerIcon.svg" alt="Manager" width={56} height={36} />;
  return null;
};

const TeamManagementModal = ({ isOpen, onClose }: TeamManagementModalProps) => {
  const { user, setUser, setUserState } = useUser();
  const { t } = useLanguage();
  const [team, setTeam] = useState<Employee[]>([]);
  const [maxEmployees, setMaxEmployees] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [originalTeam, setOriginalTeam] = useState<Employee[]>([]);
  const [animatingCount, setAnimatingCount] = useState<string | null>(null);
  const [pressingButton, setPressingButton] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      console.log("TeamManagementModal - user data:", {
        employeesAvailable: user.employeesAvailable,
        teamMembers: user.teamMembers,
        aiSkinnedEmployees: user.aiSkinnedEmployees
      });

      // Find the employeesAvailable entry for the current stage
      const currentStageEmployees = user.employeesAvailable?.find(
        (emp) => emp.stage === user.startupStage
      ) || user.employeesAvailable?.[0];

      const aiSkinnedEmployees = user.aiSkinnedEmployees || [];

      const ensureAllRoles = (inputTeam: Employee[]) => {
        const allRoles = ["ceo", "developer", "sales", "designer", "qa", "manager"];
        const defaultSalaries: Record<string, number> = {
          ceo: 1000,
          dev: 1200,
          developer: 1200,
          sales: 1200,
          qa: 800,
          designer: 1000,
          manager: 1000,
        };

        const findExistingByRole = (role: string) => {
          if (role === "developer") {
            return inputTeam.find((e) => ["dev", "developer"].includes(e.roleName.toLowerCase()));
          }
          return inputTeam.find((e) => e.roleName.toLowerCase() === role);
        };

        const merged: Employee[] = [];
        for (const role of allRoles) {
          const existing = findExistingByRole(role);
          if (existing) {
            merged.push(existing);
          } else {
            merged.push({
              _id: `locked-${role}`,
              roleName: role === "developer" ? "developer" : role,
              skinnedRolename: "",
              salary: defaultSalaries[role] ?? 1000,
              quantity: 0,
            });
          }
        }
        return merged;
      };

      const isAdvancedRoleUnlocked = (roleName: string) => {
        const role = roleName.toLowerCase();
        if (!["designer", "qa", "manager"].includes(role)) return true;
        const stage = (user.startupStage || "").toLowerCase();
        return stage !== "fff" && stage !== "angels";
      };

      if (currentStageEmployees?.availableEmployes && currentStageEmployees.availableEmployes.length > 0) {
        const availableEmployees = currentStageEmployees.availableEmployes;

        let newTeam = availableEmployees.map((emp, idx) => {
          const existingMember = user.teamMembers?.find((tm) => tm.roleName === emp.roleName);
          return {
            _id: emp._id,
            roleName: emp.roleName,
            skinnedRolename: aiSkinnedEmployees[idx]?.roleName || "",
            salary: emp.salary,
            quantity: existingMember ? existingMember.quantity : 0,
          };
        });

        // Ensure Designer/QA/Manager also show up as locked cards if not available yet
        newTeam = ensureAllRoles(newTeam).map((emp) => {
          if (!isAdvancedRoleUnlocked(emp.roleName)) return { ...emp, quantity: 0 };
          return emp;
        });

        setTeam(newTeam);
        setOriginalTeam(JSON.parse(JSON.stringify(newTeam))); // Deep copy for comparison
        setMaxEmployees(currentStageEmployees.maximum_allowed_employess || 0);
        setTotalCount(newTeam.reduce((sum, emp) => sum + emp.quantity, 0));
      }
      // Fallback: Use teamMembers if employeesAvailable is empty
      else if (user.teamMembers && user.teamMembers.length > 0) {
        console.log("TeamManagementModal - Using teamMembers as fallback");

        // Default salaries by role (matching backend defaults)
        const defaultSalaries: Record<string, number> = {
          ceo: 1000,
          dev: 1200,
          developer: 1200,
          sales: 1200,
          qa: 800,
          designer: 1000,
          manager: 1000,
        };

        let newTeam = user.teamMembers.map((member, idx) => {
          const roleLower = member.roleName.toLowerCase();
          const salary = member.salary || defaultSalaries[roleLower] || 1000;

          return {
            _id: member._id || `temp-${idx}`,
            roleName: member.roleName,
            skinnedRolename: aiSkinnedEmployees[idx]?.roleName || "",
            salary: salary,
            quantity: member.quantity || 0,
          };
        });

        newTeam = ensureAllRoles(newTeam).map((emp) => {
          if (!isAdvancedRoleUnlocked(emp.roleName)) return { ...emp, quantity: 0 };
          return emp;
        });

        setTeam(newTeam);
        setOriginalTeam(JSON.parse(JSON.stringify(newTeam))); // Deep copy for comparison
        // Use a reasonable default or calculate from current team size
        const currentTotal = newTeam.reduce((sum, emp) => sum + emp.quantity, 0);
        setMaxEmployees(Math.max(currentTotal + 5, 10)); // Default to at least 10 or current + 5
        setTotalCount(currentTotal);
      } else {
        console.warn("TeamManagementModal - No team data found");
        setTeam([]);
        setMaxEmployees(0);
        setTotalCount(0);
      }
    } else if (!isOpen) {
      // Reset when modal closes
      setTeam([]);
      setOriginalTeam([]);
      setMaxEmployees(0);
      setTotalCount(0);
    }
  }, [user, isOpen]);

  // Handle modal open/close animations
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      // Trigger animation after render
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Remove from DOM after animation completes
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getDisplayRoleName = (roleName: string) => {
    const lower = roleName.toLowerCase();
    if (lower === "qa") return "QA";
    if (lower === "ceo") return "CEO";
    if (lower === "dev" || lower === "developer") return "Developer";
    return roleName.charAt(0).toUpperCase() + roleName.slice(1);
  };

  const isAdvancedRoleLocked = (roleName: string) => {
    const role = roleName.toLowerCase();
    if (!["designer", "qa", "manager"].includes(role)) return false;
    const stage = (user?.startupStage || "").toLowerCase();
    return stage === "fff" || stage === "angels";
  };

  const increaseCount = (roleName: string) => {
    if (isAdvancedRoleLocked(roleName)) return;
    if (totalCount < maxEmployees) {
      setAnimatingCount(roleName);
      setPressingButton(`${roleName}-plus`);
      setTeam((prevTeam) =>
        prevTeam.map((emp) =>
          emp.roleName === roleName ? { ...emp, quantity: emp.quantity + 1 } : emp
        )
      );
      setTotalCount((prev) => prev + 1);
      
      // Clear button press animation after 150ms
      setTimeout(() => setPressingButton(null), 150);
      // Clear count animation after 400ms
      setTimeout(() => setAnimatingCount(null), 400);
    }
  };

  const decreaseCount = (roleName: string) => {
    if (isAdvancedRoleLocked(roleName)) return;
    setAnimatingCount(roleName);
    setPressingButton(`${roleName}-minus`);
    setTeam((prevTeam) =>
      prevTeam.map((emp) =>
        emp.roleName === roleName ? { ...emp, quantity: Math.max(emp.quantity - 1, 0) } : emp
      )
    );
    setTotalCount((prev) => Math.max(prev - 1, 0));
    
    // Clear button press animation after 150ms
    setTimeout(() => setPressingButton(null), 150);
    // Clear count animation after 400ms
    setTimeout(() => setAnimatingCount(null), 400);
  };

  const totalCost = useMemo(() => {
    return team.reduce((sum, emp) => sum + (emp.salary * emp.quantity), 0);
  }, [team]);

  const originalTotalCost = useMemo(() => {
    return originalTeam.reduce((sum, emp) => sum + (emp.salary * emp.quantity), 0);
  }, [originalTeam]);

  const costDifference = useMemo(() => {
    return totalCost - originalTotalCost;
  }, [totalCost, originalTotalCost]);

  const hasChanges = useMemo(() => {
    if (originalTeam.length === 0 || team.length === 0) return false;
    // Create a map of original team by roleName for easier comparison
    const originalMap = new Map(originalTeam.map(emp => [emp.roleName, emp]));
    return team.some((emp) => {
      const original = originalMap.get(emp.roleName);
      return original && emp.quantity !== original.quantity;
    });
  }, [team, originalTeam]);

  const handleConfirm = async () => {
    const newTeamMembers = team.map((emp) => ({
      _id: emp._id,
      roleName: emp.roleName,
      quantity: emp.quantity,
      salary: emp.salary,
    }));

    if (!user) return;

    try {
      // Call API to update team members
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/turn`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("userToken") || "",
        },
        body: JSON.stringify({
          gameId: user.gameId,
          employees: newTeamMembers.map((emp) => ({
            roleName: emp.roleName,
            quantity: emp.quantity,
          })),
          taskIds: [],
          bugIds: [],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Update user state with the response from server
        setUser(data);
        setUserState(data);

        // Also update localStorage
        localStorage.setItem("userData", JSON.stringify(data));
      } else {
        console.error("Failed to update team members");
        // Fallback to local update if API fails
        const updatedUser: UserData = {
          ...user,
          teamMembers: newTeamMembers,
        };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setUserState(updatedUser);
      }
    } catch (error) {
      console.error("Error updating team members:", error);
      // Fallback to local update if API fails
      const updatedUser: UserData = {
        ...user,
        teamMembers: newTeamMembers,
      };
      localStorage.setItem("userData", JSON.stringify(updatedUser));
      setUserState(updatedUser);
    }

    onClose();
  };

  if (!shouldRender) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center px-4 md:px-7 lg:px-0">
      <div 
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      ></div>

      <div
        className={`relative w-full max-w-5xl rounded-2xl bg-[#1B1B1D96] border border-white/10 p-4 sm:p-6 shadow-lg backdrop-blur-sm bg-opacity-70 transition-all duration-300 max-h-[90vh] overflow-y-auto ${
          isAnimating 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-4'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white">{t("modals.teamManagement.title")}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors flex-shrink-0"
          >
            <X size={24} />
          </button>
        </div>

        {/* Team Cards */}
        {team.length === 0 ? (
          <div className="flex items-center justify-center py-12 mb-6">
            <p className="text-gray-400 text-lg">
              No employees available
            </p>
          </div>
        ) : (
          <div className="gap-3 sm:gap-4 mb-4 sm:mb-6 grid grid-cols-3">
            {team.map((member, index) => {
              const roleName = member.roleName;
              const isLocked = isAdvancedRoleLocked(member.roleName);
              const isCeo = member.roleName?.toLowerCase() === "ceo";

              return (
                <div
                  key={index}
                  className={`flex-1 min-w-0 rounded-xl bg-[#161618] p-3 sm:p-4 flex flex-col ${isLocked ? "opacity-50" : ""}`}
                >
                  <div className="flex w-full relative">
                    {/* Price on left */}
                    <div className="text-grey font-light text-xs sm:text-sm mb-0 mr-2 flex items-start absolute top-0 left-0">
                      ${member.salary}
                    </div>
                    {/* Everything else centered */}
                    <div className="flex-1 flex flex-col items-center mt-6 sm:mt-10">
                      {/* Icon */}
                      <div className="mb-2 sm:mb-3 py-8 sm:py-14 flex items-center justify-center h-12 sm:h-16">
                        <div className="scale-75 sm:scale-100">
                          {getRoleIcon(member.roleName)}
                        </div>
                      </div>
                      {/* Role Name */}
                      <div className="text-white text-sm sm:text-xl font-medium mb-2 sm:mb-4 capitalize text-center">
                        {getDisplayRoleName(roleName)}
                      </div>
                      {isLocked && (
                        <div className="mb-2 sm:mb-3 text-[10px] sm:text-xs text-gray-400 text-center">Unlocks at Pre-Seed</div>
                      )}
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 sm:gap-3 mt-auto">
                        <button
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md flex items-center justify-center text-white transition-all duration-200 ease-out ${
                            pressingButton === `${member.roleName}-minus` 
                              ? "scale-90 bg-[#2A3F5F] shadow-inner" 
                              : "scale-100"
                          } ${isCeo || isLocked || member.quantity <= 0
                              ? "opacity-50 cursor-not-allowed bg-gray-600"
                              : "bg-[#1C2E5B] hover:bg-[#2A3F5F] hover:scale-105 hover:shadow-lg active:scale-90"
                            }`}
                          onClick={() => decreaseCount(member.roleName)}
                          disabled={isCeo || isLocked || member.quantity <= 0}
                        >
                          <Minus 
                            size={14} 
                            className={`sm:w-4 sm:h-4 transition-all duration-200 ${
                              pressingButton === `${member.roleName}-minus` 
                                ? "scale-110" 
                                : "scale-100"
                            }`} 
                          />
                        </button>
                        <span 
                          key={`${member.roleName}-${member.quantity}`}
                          className={`text-white font-semibold text-lg sm:text-xl min-w-[20px] sm:min-w-[24px] text-center transition-all duration-300 ease-out ${
                            animatingCount === member.roleName 
                              ? "scale-125 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]" 
                              : "scale-100"
                          }`}
                        >
                          {member.quantity}
                        </span>
                        <button
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-md flex items-center justify-center text-white transition-all duration-200 ease-out ${
                            pressingButton === `${member.roleName}-plus` 
                              ? "scale-90 bg-[#2A3F5F] shadow-inner" 
                              : "scale-100"
                          } ${isCeo || isLocked || totalCount >= maxEmployees
                              ? "opacity-50 cursor-not-allowed bg-gray-600"
                              : "bg-[#1C2E5B] hover:bg-[#2A3F5F] hover:scale-105 hover:shadow-lg active:scale-90"
                            }`}
                          onClick={() => increaseCount(member.roleName)}
                          disabled={isCeo || isLocked || totalCount >= maxEmployees}
                        >
                          <Plus 
                            size={14} 
                            className={`sm:w-4 sm:h-4 transition-all duration-200 ${
                              pressingButton === `${member.roleName}-plus` 
                                ? "scale-110 rotate-90" 
                                : "scale-100 rotate-0"
                            }`} 
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer */}
        <div className={`flex flex-col sm:flex-row items-stretch sm:items-center gap-3 ${hasChanges ? 'sm:space-x-4' : ''}`}>
          {/* Total Cost Button - Only show when there are changes */}
          {hasChanges && (
            <button
              className="w-full sm:flex-1 rounded-3xl bg-[#24303F] hover:bg-[#2A3F5F] py-3 px-4 text-white font-medium transition-colors text-sm sm:text-base"
              disabled
            >
              {costDifference > 0 ? '+' : ''}${costDifference}
            </button>
          )}

          {/* Confirm Button */}
          <button
            className={`${hasChanges ? 'w-full sm:flex-1' : 'w-full'} rounded-3xl bg-gradient-to-r from-green-400 to-cyan-400 hover:from-green-500 hover:to-cyan-500 py-3 px-4 text-black font-medium transition-all text-sm sm:text-base`}
            onClick={handleConfirm}
          >
            {t("modals.teamManagement.confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamManagementModal;
