
export interface JiraStory {
  key: string;
  summary: string;
  description: string;
  acceptanceCriteria: string;
  notes: string;
}

export type TestType = "manual" | "automated" | "skip";

export interface TestStep {
  step: string;
  expected: string;
}

export interface TestCase {
  id: string;
  title: string;
  type: TestType;
  priority: "high" | "normal" | "low";
  preconditions?: string;
  steps: TestStep[];
  tags?: string[];
  automationNotes?: string;
}
