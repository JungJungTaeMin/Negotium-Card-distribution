import { useState } from "react";
import { useNavigate } from "react-router";
import { Department, getPersonsByDepartment } from "../utils/mockData";
import { ChevronRight, ChevronDown, Building, Users, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { cn } from "./ui/utils";

interface OrganizationTreeProps {
  departments: Department[];
  companyId: string;
}

export function OrganizationTree({ departments, companyId }: OrganizationTreeProps) {
  return (
    <div className="space-y-2">
      {departments.map((dept) => (
        <DepartmentNode key={dept.id} department={dept} />
      ))}
    </div>
  );
}

function DepartmentNode({ department }: { department: Department }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = department.children && department.children.length > 0;
  const persons = getPersonsByDepartment(department.id);

  const indentLevel = department.depth;

  return (
    <div>
      {/* Department Header */}
      <div
        className={cn(
          "flex items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group",
          indentLevel > 0 && "ml-6"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Expand/Collapse Icon */}
        {hasChildren || persons.length > 0 ? (
          <button className="size-5 flex items-center justify-center text-gray-400 hover:text-gray-600">
            {isExpanded ? (
              <ChevronDown className="size-4" />
            ) : (
              <ChevronRight className="size-4" />
            )}
          </button>
        ) : (
          <div className="size-5" />
        )}

        {/* Department Icon */}
        <div className="size-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <Building className="size-4 text-blue-600" />
        </div>

        {/* Department Name */}
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{department.name}</h3>
          <p className="text-xs text-gray-500">
            {persons.length}명의 멤버
            {hasChildren && ` · ${department.children?.length}개 하위 조직`}
          </p>
        </div>

        {/* Depth Badge */}
        <Badge variant="secondary" className="text-xs">
          Level {department.depth + 1}
        </Badge>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className={cn("mt-2 space-y-2", indentLevel > 0 && "ml-6")}>
          {/* Persons in this department */}
          {persons.length > 0 && (
            <div className="ml-11 space-y-1">
              {persons.map((person) => (
                <div
                  key={person.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/persons/${person.id}`);
                  }}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-blue-50 cursor-pointer group"
                >
                  <div className="size-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="size-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900">{person.name}</p>
                    <p className="text-xs text-gray-500">{person.position?.name}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {person.email}
                  </Badge>
                </div>
              ))}
            </div>
          )}

          {/* Child Departments */}
          {hasChildren && (
            <div className="space-y-2">
              {department.children?.map((child) => (
                <DepartmentNode key={child.id} department={child} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
