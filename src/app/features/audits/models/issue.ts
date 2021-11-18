export class IssueBase {
    title: string;
    category: IssueCategory;
    severityLevel: IssueSeverityLevel;
    status: IssueStatus;
    details: string;
}

export enum IssueCategory {
    "No Category",
    "General Building and Construction",
    "Exterior Physical Security Controls",
    "Internal Physical Security Controls",
    "Locks",
    "Lock procedures",
    "Access Procedures",
    "Access Control System",
    "Burglar Alarms",
    "CCTV Systems",
    "Security Guarding",
    "Immediate Response",
    "Shipping"
}

export enum IssueSeverityLevel {
    Low,
    Medium,
    High,
    None
}

export enum IssueStatus {
    None,
    Open,
    Started,
    "Action Assigned",
    Closed
}
  
  
  
  