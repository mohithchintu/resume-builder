import React, { useContext, useState } from "react";
import { DndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { ResumeInfoContext } from "@/context/ResumeInfoContext";
import PersonalDetailPreview from "./preview/PersonalDetailPreview";
import SummeryPreview from "./preview/SummeryPreview";
import ExperiencePreview from "./preview/ExperiencePreview";
import EducationalPreview from "./preview/EducationalPreview";
import SkillsPreview from "./preview/SkillsPreview";

// Draggable component with custom cursor and smooth movement
function Draggable({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition: !isDragging ? "transform 0.3s ease" : undefined, // Smooth transition when not dragging
    cursor: isDragging ? "grabbing" : "grab", // Change cursor on drag
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      // Tailwind classes for hover effect, box styling, and custom cursor
      className="p-4 border hover:border-blue-500 hover:shadow-lg transition-all duration-300 ease-in-out rounded-md"
    >
      {children}
    </div>
  );
}

function Droppable({ id, children }) {
  const { setNodeRef } = useDroppable({
    id: id,
  });

  return <div ref={setNodeRef}>{children}</div>;
}

function ResumePreview() {
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [sections, setSections] = useState([
    "personalDetail",
    "summary",
    "experience",
    "education",
    "skills",
  ]);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = sections.indexOf(active.id);
      const newIndex = sections.indexOf(over.id);

      // Reorder the sections
      const newOrder = arrayMove(sections, oldIndex, newIndex);
      setSections(newOrder);

      console.log(`Moved section ${active.id} to position ${newIndex}`);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div
        className="flex flex-col shadow-lg h-full p-14 border-t-4 gap-y-2"
        style={{ borderColor: resumeInfo?.themeColor }}
      >
        {sections.map((sectionId) => {
          switch (sectionId) {
            case "personalDetail":
              return (
                <Droppable id="personalDetail" key="personalDetail">
                  <Draggable id="personalDetail">
                    <PersonalDetailPreview resumeInfo={resumeInfo} />
                  </Draggable>
                </Droppable>
              );
            case "summary":
              return (
                <Droppable id="summary" key="summary">
                  <Draggable id="summary">
                    <SummeryPreview resumeInfo={resumeInfo} />
                  </Draggable>
                </Droppable>
              );
            case "experience":
              return (
                resumeInfo?.Experience?.length > 0 && (
                  <Droppable id="experience" key="experience">
                    <Draggable id="experience">
                      <ExperiencePreview resumeInfo={resumeInfo} />
                    </Draggable>
                  </Droppable>
                )
              );
            case "education":
              return (
                resumeInfo?.education?.length > 0 && (
                  <Droppable id="education" key="education">
                    <Draggable id="education">
                      <EducationalPreview resumeInfo={resumeInfo} />
                    </Draggable>
                  </Droppable>
                )
              );
            case "skills":
              return (
                resumeInfo?.skills?.length > 0 && (
                  <Droppable id="skills" key="skills">
                    <Draggable id="skills">
                      <SkillsPreview resumeInfo={resumeInfo} />
                    </Draggable>
                  </Droppable>
                )
              );
            default:
              return null;
          }
        })}
      </div>
    </DndContext>
  );
}

export default ResumePreview;
