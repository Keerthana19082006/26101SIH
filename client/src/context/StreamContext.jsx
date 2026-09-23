import { createContext, useContext, useState, useEffect } from 'react';
import { STREAMS, STREAM_ROLES } from '../data/streamData';
import {
  ALL_COURSES_CATALOG,
  VIRTUAL_LABS,
  DISCUSSIONS,
  DEFAULT_PROGRESS_TIMELINE,
  DEFAULT_NOTIFICATIONS,
} from '../data/portalData';
import { ROLE_BLUEPRINTS } from '../data/roleBlueprints';
import { evaluateEmployeeAssessment } from '../services/roleAssessmentEngine';
import {
  getDepartmentConfig,
  getRoleConfig,
  getDepartmentCourses,
  getRecommendedCourses,
  getNextBestAction,
  getDepartmentTasks,
  getDepartmentFutureRoles,
  getContextualNotifications,
  getSuggestedQuestions,
  generateContextualAIReply
} from '../services/domainConfigEngine';
import { getVirtualLabById } from '../data/departmentVirtualLabs';
import { assessmentAPI, assistantAPI } from '../services/api';

const StreamContext = createContext(null);
export const EmployeeContext = StreamContext; // Alias for Phase 4 architecture

export function StreamProvider({ children }) {
  // ── 1. Active Stream State ──────────────────────────────────────────────────
  const [selectedStream, setSelectedStream] = useState(() => {
    const saved = localStorage.getItem('ks_selected_stream');
    return saved ? JSON.parse(saved) : STREAMS[0]; // Default: Statistics
  });

  const [assessmentAnswers, setAssessmentAnswers] = useState(() => {
    const saved = localStorage.getItem('ks_stream_answers');
    return saved ? JSON.parse(saved) : {};
  });

  const [assessmentCompleted, setAssessmentCompleted] = useState(() => {
    return localStorage.getItem('ks_assessment_completed') === 'true';
  });

  const [onboardingStep, setOnboardingStep] = useState(() => {
    return localStorage.getItem('ks_onboarding_step') || 'stream_selection'; // stream_selection | assessment | gap_analysis | completed
  });

  const [diagnosticAttemptId, setDiagnosticAttemptId] = useState(() => {
    return localStorage.getItem('ks_current_attempt_id') || `asmt-init-${Date.now()}`;
  });

  // ── 2. Employee Profile Metadata ────────────────────────────────────────────
  const [employee, setEmployee] = useState(() => {
    const saved = localStorage.getItem('ks_employee_profile');
    return saved ? JSON.parse(saved) : null;
  });

  // ── 3. Dynamic Gap Analysis ─────────────────────────────────────────────────
  const [gapAnalysis, setGapAnalysis] = useState(() => {
    const empId = employee?.id || 'demo-employee-01';
    const savedAnswers = localStorage.getItem('ks_role_answers');
    const parsedAnswers = savedAnswers ? JSON.parse(savedAnswers) : assessmentAnswers;
    return evaluateEmployeeAssessment(empId, parsedAnswers);
  });

  // Re-run gap analysis whenever employee, stream, or answers change
  useEffect(() => {
    const empId = employee?.id || 'demo-employee-01';
    const savedAnswers = localStorage.getItem('ks_role_answers');
    const parsedAnswers = savedAnswers ? JSON.parse(savedAnswers) : assessmentAnswers;
    const data = evaluateEmployeeAssessment(empId, parsedAnswers);
    setGapAnalysis(data);
  }, [employee, selectedStream, assessmentAnswers]);

  // ── 4. Virtual Labs State & Submissions ──────────────────────────────────────
  const [virtualLabs, setVirtualLabs] = useState(() => {
    const saved = localStorage.getItem('ks_virtual_labs');
    return saved ? JSON.parse(saved) : VIRTUAL_LABS;
  });

  const [labSubmissions, setLabSubmissions] = useState(() => {
    const saved = localStorage.getItem('ks_lab_submissions');
    return saved ? JSON.parse(saved) : {};
  });

  // ── 5. Discussions State ────────────────────────────────────────────────────
  const [discussions, setDiscussions] = useState(() => {
    const saved = localStorage.getItem('ks_discussions');
    return saved ? JSON.parse(saved) : DISCUSSIONS;
  });

  // ── 6. Course Catalog & Enrollments ─────────────────────────────────────────
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('ks_courses');
    return saved ? JSON.parse(saved) : ALL_COURSES_CATALOG;
  });

  // ── 7. Progress History Timeline ────────────────────────────────────────────
  const [progressTimeline, setProgressTimeline] = useState(() => {
    const saved = localStorage.getItem('ks_progress_timeline');
    return saved ? JSON.parse(saved) : DEFAULT_PROGRESS_TIMELINE;
  });

  // ── 8. Notifications ────────────────────────────────────────────────────────
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('ks_notifications');
    return saved ? JSON.parse(saved) : DEFAULT_NOTIFICATIONS;
  });

  // ── 9. AI Assistant State ───────────────────────────────────────────────────
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [assistantMessages, setAssistantMessages] = useState([
    {
      id: 'msg-init',
      sender: 'ai',
      text: 'Hello Arjun. I am your AI Competency & Learning Assistant. I have analyzed your diagnostic assessment in Statistics & Data Analytics. How can I help guide your professional development today?',
      timestamp: 'Just now',
    },
  ]);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const selectDemoEmployee = (demoEmp) => {
    const updatedEmployee = {
      joiningDate: '12 August 2021',
      igotStatus: 'Connected & Synced',
      activitiesCompleted: 8,
      totalActivities: 11,
      learningStreakDays: 14,
      learningHoursTotal: 34,
      id: demoEmp.id,
      name: demoEmp.name,
      avatarInitials: demoEmp.avatarInitials,
      designation: demoEmp.currentRole,
      targetRole: demoEmp.targetRole,
      department: demoEmp.department,
      ministry: demoEmp.ministry,
      station: demoEmp.station,
      cadre: demoEmp.cadre,
      payLevel: demoEmp.payLevel,
      igotId: demoEmp.igotId,
      overallCompetency: demoEmp.overallCompetency,
      competencyGrowth: demoEmp.competencyGrowth,
      prioritySkillGapsCount: demoEmp.prioritySkillGapsCount,
      criticalGapsCount: demoEmp.criticalGapsCount,
      learningProgressPercent: demoEmp.learningProgressPercent,
      futureRoleReadiness: demoEmp.futureRoleReadiness,
      competenciesFocus: demoEmp.competencies,
    };

    setEmployee(updatedEmployee);
    localStorage.setItem('ks_employee_profile', JSON.stringify(updatedEmployee));

    // Map department to matching professional stream to harmonize dashboard visuals
    let matchedStream = STREAMS[0];
    if (demoEmp.department.includes('Agriculture')) {
      matchedStream = STREAMS.find(s => s.id === 'data_eng') || STREAMS[0];
    } else if (demoEmp.department.includes('Health')) {
      matchedStream = STREAMS.find(s => s.id === 'public_policy') || STREAMS[0];
    } else if (demoEmp.department.includes('Labour')) {
      matchedStream = STREAMS.find(s => s.id === 'field_ops') || STREAMS[0];
    } else if (demoEmp.department.includes('Education')) {
      matchedStream = STREAMS.find(s => s.id === 'public_policy') || STREAMS[0];
    }

    setSelectedStream(matchedStream);
    localStorage.setItem('ks_selected_stream', JSON.stringify(matchedStream));

    // Check if this demo employee has completed initial diagnostic (Phase 3 Rule)
    const isCompleted = localStorage.getItem(`ks_diagnostic_completed_${demoEmp.id}`) === 'true';
    if (isCompleted) {
      setAssessmentCompleted(true);
      localStorage.setItem('ks_assessment_completed', 'true');
      setOnboardingStep('completed');
      localStorage.setItem('ks_onboarding_step', 'completed');
    } else {
      setAssessmentCompleted(false);
      localStorage.removeItem('ks_assessment_completed');
      setOnboardingStep('assessment');
      localStorage.setItem('ks_onboarding_step', 'assessment');
    }

    // Set contextual initial welcome message for AI Assistant
    const empDeptConfig = getDepartmentConfig(demoEmp.id);
    setAssistantMessages([
      {
        id: `msg-init-${Date.now()}`,
        sender: 'ai',
        text: `Namaste ${demoEmp.name}. I am your AI Competency Assistant for **${empDeptConfig.name}** (${empDeptConfig.domain}). I am grounded in your role as **${empDeptConfig.roleConfig.title}**. How may I assist your professional development today?`,
        actions: [
          { label: 'Why are these courses recommended?', path: '/explore-learning' },
          { label: 'View Skill Gaps', path: '/skill-gaps' },
          { label: 'How do I prepare for promotion?', path: '/future-role' },
        ],
        timestamp: 'Just now',
      }
    ]);
  };

  const selectStream = (stream) => {
    setSelectedStream(stream);
    localStorage.setItem('ks_selected_stream', JSON.stringify(stream));
    setOnboardingStep('assessment');
    localStorage.setItem('ks_onboarding_step', 'assessment');
  };

  const submitAssessment = (answers, isRoleBased = false) => {
    setAssessmentAnswers(answers);
    setAssessmentCompleted(true);
    if (isRoleBased || (employee?.id && ROLE_BLUEPRINTS[employee.id])) {
      localStorage.setItem('ks_role_answers', JSON.stringify(answers));
      const evalResult = evaluateEmployeeAssessment(employee.id, answers);
      setGapAnalysis(evalResult);

      // Persist AssessmentAttempt, EmployeeCompetency, and SkillGap (Step 17)
      const assessmentAttempt = {
        employee: {
          id: employee.id,
          name: employee.name,
          department: employee.department,
          role: employee.designation,
        },
        assessment: `diagnostic-${employee.id}`,
        questionsCount: evalResult.totalQuestions,
        answers,
        score: evalResult.overallScore,
        competencyScores: evalResult.competencyScores,
        criticalGaps: evalResult.criticalGaps,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(`ks_assessment_attempt_${employee.id}`, JSON.stringify(assessmentAttempt));

      const employeeCompetency = {
        employeeId: employee.id,
        competencyBreakdown: evalResult.competencyBreakdown,
        overallScore: evalResult.overallScore,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(`ks_employee_competency_${employee.id}`, JSON.stringify(employeeCompetency));

      const skillGaps = {
        employeeId: employee.id,
        criticalGaps: evalResult.criticalGaps,
        developingGaps: evalResult.developingGaps,
        strongAreas: evalResult.strongAreas,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(`ks_skill_gaps_${employee.id}`, JSON.stringify(skillGaps));

      localStorage.setItem(`ks_recommendations_${employee.id}`, JSON.stringify(evalResult.recommendedCourses));
      localStorage.setItem(`ks_learning_path_${employee.id}`, JSON.stringify(evalResult.learningPath));

      // Asynchronously submit to PostgreSQL backend
      const backendAttemptId = localStorage.getItem('ks_backend_attempt_id');
      if (backendAttemptId) {
        assessmentAPI.submitAssessment(backendAttemptId, answers).catch(() => {});
      }

      // Also update employee overall score & critical gaps count in state
      const updatedEmp = {
        ...employee,
        overallCompetency: evalResult.overallScore,
        criticalGapsCount: evalResult.criticalGaps.length,
        prioritySkillGapsCount: evalResult.criticalGaps.length + evalResult.developingGaps.length,
      };
      setEmployee(updatedEmp);
      localStorage.setItem('ks_employee_profile', JSON.stringify(updatedEmp));

      // Preserve historical assessment attempts (Section 9 & 17)
      try {
        const historyKey = `ks_diagnostic_history_${employee.id}`;
        const savedHistory = localStorage.getItem(historyKey);
        const history = savedHistory ? JSON.parse(savedHistory) : [];
        const currentAttemptId = localStorage.getItem('ks_current_attempt_id') || `asmt-${employee.id}-${Date.now()}`;
        
        let found = false;
        const updatedHistory = history.map(att => {
          if (att.attemptId === currentAttemptId) {
            found = true;
            return {
              ...att,
              status: 'COMPLETED',
              completedAt: new Date().toISOString(),
              score: evalResult.overallScore,
            };
          }
          return att;
        });
        if (!found) {
          updatedHistory.push({
            attemptId: currentAttemptId,
            employeeId: employee.id,
            startedAt: new Date().toISOString(),
            completedAt: new Date().toISOString(),
            status: 'COMPLETED',
            score: evalResult.overallScore,
          });
        }
        localStorage.setItem(historyKey, JSON.stringify(updatedHistory));
      } catch (e) {
        // safe fallback
      }
    } else {
      localStorage.setItem('ks_stream_answers', JSON.stringify(answers));
    }
    localStorage.setItem('ks_assessment_completed', 'true');
    setOnboardingStep('gap_analysis');
    localStorage.setItem('ks_onboarding_step', 'gap_analysis');
  };

  /**
   * Initializes a brand new diagnostic assessment attempt for the employee.
   * Every "Enter Employee" click triggers this to start a fresh quiz attempt.
   */
  const startNewDiagnosticAttempt = (employeeId) => {
    const attemptId = `asmt-${employeeId}-${Date.now()}`;
    setDiagnosticAttemptId(attemptId);
    setAssessmentAnswers({});
    setAssessmentCompleted(false);
    setOnboardingStep('assessment');
    localStorage.removeItem('ks_assessment_completed');
    localStorage.setItem('ks_onboarding_step', 'assessment');
    localStorage.setItem('ks_current_attempt_id', attemptId);

    // Record this attempt in history
    try {
      const historyKey = `ks_diagnostic_history_${employeeId}`;
      const saved = localStorage.getItem(historyKey);
      const history = saved ? JSON.parse(saved) : [];
      history.push({
        attemptId,
        employeeId,
        startedAt: new Date().toISOString(),
        status: 'IN_PROGRESS',
      });
      localStorage.setItem(historyKey, JSON.stringify(history));
      
      // Async notify PostgreSQL backend to record new attempt
      assessmentAPI.startDiagnostic(employeeId)
        .then(res => {
          if (res?.data?.attemptId) {
            localStorage.setItem('ks_backend_attempt_id', res.data.attemptId);
          }
        })
        .catch(() => {
          // Graceful fallback to client session attempt if backend offline
        });
    } catch (e) {
      // safe fallback
    }
  };

  const finishOnboarding = () => {
    if (employee?.id) {
      localStorage.setItem(`ks_diagnostic_completed_${employee.id}`, 'true');
    }
    setAssessmentCompleted(true);
    localStorage.setItem('ks_assessment_completed', 'true');
    setOnboardingStep('completed');
    localStorage.setItem('ks_onboarding_step', 'completed');
  };

  const skipToDashboard = (stream) => {
    const s = stream || selectedStream || STREAMS[0];
    setSelectedStream(s);
    localStorage.setItem('ks_selected_stream', JSON.stringify(s));
    setAssessmentCompleted(true);
    localStorage.setItem('ks_assessment_completed', 'true');
    setOnboardingStep('completed');
    localStorage.setItem('ks_onboarding_step', 'completed');
  };

  const retakeAssessment = () => {
    setAssessmentAnswers({});
    setAssessmentCompleted(false);
    setOnboardingStep('assessment');
    localStorage.removeItem('ks_stream_answers');
    localStorage.setItem('ks_assessment_completed', 'false');
    localStorage.setItem('ks_onboarding_step', 'assessment');
  };

  const switchStream = (streamId, keepInDashboard = true) => {
    const stream = STREAMS.find(s => s.id === streamId) || STREAMS[0];
    setSelectedStream(stream);
    localStorage.setItem('ks_selected_stream', JSON.stringify(stream));

    if (!keepInDashboard) {
      setAssessmentAnswers({});
      setAssessmentCompleted(false);
      setOnboardingStep('assessment');
      localStorage.removeItem('ks_stream_answers');
      localStorage.setItem('ks_assessment_completed', 'false');
      localStorage.setItem('ks_onboarding_step', 'assessment');
    }
  };

  const resetAll = () => {
    setEmployee(null);
    setSelectedStream(null);
    setAssessmentAnswers({});
    setAssessmentCompleted(false);
    setOnboardingStep('stream_selection');
    localStorage.removeItem('ks_is_logged_in');
    localStorage.removeItem('ks_token');
    localStorage.removeItem('ks_user');
    localStorage.removeItem('ks_active_portal');
    localStorage.removeItem('ks_employee_profile');
    localStorage.removeItem('ks_selected_stream');
    localStorage.removeItem('ks_stream_answers');
    localStorage.removeItem('ks_role_answers');
    localStorage.removeItem('ks_assessment_completed');
    localStorage.removeItem('ks_onboarding_step');
    localStorage.removeItem('ks_lab_submissions');
  };

  // Submit a Virtual Lab evaluation
  const submitVirtualLabAnalysis = (labId, evaluationResults) => {
    const updatedSubmissions = {
      ...labSubmissions,
      [labId]: {
        evaluatedAt: new Date().toISOString(),
        results: evaluationResults,
      },
    };
    setLabSubmissions(updatedSubmissions);
    localStorage.setItem('ks_lab_submissions', JSON.stringify(updatedSubmissions));

    // Resolve lab details safely
    const lab = getVirtualLabById(labId) || virtualLabs.find(l => l.id === labId) || {
      id: labId,
      title: 'Practical Competency Laboratory',
      targetCompetency: 'Domain Competency',
    };

    // Add progress timeline entry
    const newTimelineItem = {
      id: `evt-lab-${Date.now()}`,
      date: 'Today',
      title: `Virtual Lab: ${lab.title}`,
      category: 'Virtual Lab',
      score: `${evaluationResults.overallPracticalScore}%`,
      badge: 'Evaluated',
      statusColor: 'text-gov-green',
      desc: `Completed practical analysis. ${evaluationResults.keyGapTakeaway}`,
    };
    const updatedTimeline = [newTimelineItem, ...progressTimeline];
    setProgressTimeline(updatedTimeline);
    localStorage.setItem('ks_progress_timeline', JSON.stringify(updatedTimeline));

    // Push notification
    const newNotification = {
      id: `n-${Date.now()}`,
      title: `Virtual Lab Evaluated: ${lab.title}`,
      message: `Score: ${evaluationResults.overallPracticalScore}%. Practical takeaway: ${evaluationResults.keyGapTakeaway}`,
      type: 'success',
      read: false,
      time: 'Just now',
      link: '/virtual-labs',
    };
    const updatedNotifs = [newNotification, ...notifications];
    setNotifications(updatedNotifs);
    localStorage.setItem('ks_notifications', JSON.stringify(updatedNotifs));

    // Close the loop: update employee learning activity count and hours
    if (employee) {
      const updatedEmployee = {
        ...employee,
        activitiesCompleted: (employee.activitiesCompleted || 8) + 1,
        learningHoursTotal: (employee.learningHoursTotal || 34) + 1,
      };
      setEmployee(updatedEmployee);
      localStorage.setItem('ks_employee_profile', JSON.stringify(updatedEmployee));
    }

    // Refresh gap analysis with boosted practical score
    if (gapAnalysis) {
      const updatedGaps = {
        ...gapAnalysis,
        overallScore: Math.min(96, (gapAnalysis.overallScore || 70) + 1),
      };
      setGapAnalysis(updatedGaps);
    }
  };

  // Add Discussion Thread
  const addDiscussion = (newDiscussion) => {
    const updated = [newDiscussion, ...discussions];
    setDiscussions(updated);
    localStorage.setItem('ks_discussions', JSON.stringify(updated));
  };

  // Reply to Discussion
  const addDiscussionReply = (discussionId, replyText) => {
    const updated = discussions.map(d => {
      if (d.id === discussionId) {
        const newReply = {
          id: `rep-${Date.now()}`,
          author: {
            name: employee?.name || 'Civil Service Officer',
            role: employee?.designation || 'Statistical Investigator',
            dept: employee?.department || 'National Statistical Office',
            initials: employee?.avatarInitials || 'AS',
          },
          date: 'Just now',
          content: replyText,
          useful: 0,
        };
        return {
          ...d,
          repliesCount: d.repliesCount + 1,
          replies: [...(d.replies || []), newReply],
        };
      }
      return d;
    });
    setDiscussions(updated);
    localStorage.setItem('ks_discussions', JSON.stringify(updated));
  };

  // Upvote / Like Discussion
  const upvoteDiscussion = (discussionId) => {
    const updated = discussions.map(d => {
      if (d.id === discussionId) {
        return { ...d, usefulCount: d.usefulCount + 1 };
      }
      return d;
    });
    setDiscussions(updated);
    localStorage.setItem('ks_discussions', JSON.stringify(updated));
  };

  // Enroll in Course
  const toggleCourseEnrollment = (courseId) => {
    const updated = courses.map(c => {
      if (c.id === courseId) {
        return { ...c, isEnrolled: !c.isEnrolled, progress: !c.isEnrolled ? 10 : 0 };
      }
      return c;
    });
    setCourses(updated);
    localStorage.setItem('ks_courses', JSON.stringify(updated));
  };

  // ── Phase 4: Centralized Domain Configuration & Contextual Personalization ────
  const empId = employee?.id || 'demo-employee-01';
  const departmentConfig = getDepartmentConfig(empId);
  const roleConfig = departmentConfig.roleConfig;
  const domainCourses = getDepartmentCourses(empId);
  const domainRecommendedCourses = getRecommendedCourses(empId, gapAnalysis);
  const domainNextBestAction = getNextBestAction(empId, gapAnalysis);
  const domainTasks = getDepartmentTasks(empId);
  const domainFutureRoles = getDepartmentFutureRoles(empId, gapAnalysis);
  const domainNotifications = getContextualNotifications(empId);
  const suggestedAIQuestions = getSuggestedQuestions(empId, gapAnalysis);

  // AI Assistant Chat Message (Strictly Department Grounded & Backend Connected)
  const sendAIMessage = (userText, currentCourse) => {
    const userMsg = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: 'Just now',
    };
    setAssistantMessages(prev => [...prev, userMsg]);

    assistantAPI.chat({ message: userText, employeeId: empId })
      .then(res => {
        if (res?.data?.reply) {
          setAssistantMessages(prev => [
            ...prev,
            {
              id: `ai-${Date.now()}`,
              sender: 'ai',
              text: res.data.reply,
              actions: res.data.suggestedActions || [],
              provenance: res.data.provenance || [],
              timestamp: 'Just now',
            }
          ]);
          return;
        }
        throw new Error('Fallback to local');
      })
      .catch(() => {
        const { text, actions } = generateContextualAIReply(
          userText,
          employee || { name: 'Officer', designation: roleConfig.title, id: empId },
          gapAnalysis,
          currentCourse
        );
        setAssistantMessages(prev => [
          ...prev,
          {
            id: `ai-${Date.now()}`,
            sender: 'ai',
            text,
            actions,
            timestamp: 'Just now',
          }
        ]);
      });
  };

  const currentRole = STREAM_ROLES[selectedStream?.id || 'stats'] || STREAM_ROLES.stats;

  return (
    <StreamContext.Provider value={{
      selectedStream,
      assessmentAnswers,
      assessmentCompleted,
      onboardingStep,
      gapAnalysis,
      currentRole,
      employee,
      setEmployee,
      departmentConfig,
      roleConfig,
      domainCourses,
      domainRecommendedCourses,
      domainNextBestAction,
      domainTasks,
      domainFutureRoles,
      domainNotifications,
      suggestedAIQuestions,
      virtualLabs,
      labSubmissions,
      submitVirtualLabAnalysis,
      discussions,
      addDiscussion,
      addDiscussionReply,
      upvoteDiscussion,
      courses: domainCourses.length > 0 ? domainCourses : courses,
      toggleCourseEnrollment,
      progressTimeline,
      notifications: domainNotifications.length > 0 ? domainNotifications : notifications,
      setNotifications,
      isAIAssistantOpen,
      setIsAIAssistantOpen,
      assistantMessages,
      sendAIMessage,
      selectDemoEmployee,
      selectStream,
      submitAssessment,
      finishOnboarding,
      retakeAssessment,
      switchStream,
      resetAll,
      skipToDashboard,
      setOnboardingStep,
      diagnosticAttemptId,
      startNewDiagnosticAttempt,
    }}>
      {children}
    </StreamContext.Provider>
  );
}

export const useStream = () => {
  const ctx = useContext(StreamContext);
  if (!ctx) throw new Error('useStream must be used within StreamProvider');
  return ctx;
};

export const useEmployee = useStream;
