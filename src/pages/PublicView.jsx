import ResumeService from "../services/resume.service";
import Resume from "./Resume";
import { useEffect, useState } from "react";

export default function PublicView(props) {
  const viewId = props.match.params.uid;
  const [data, setData] = useState(null);  
  const [templateId, setTemplateId] = useState("Loading...")
  const editable = false

  useEffect(() => {
    async function getView() {
      const viewResponse = await ResumeService.accessView(viewId)

      try {
        const templateId = viewResponse.template_id ?? 1;
        setTemplateId(templateId)
        setData(viewResponse.content)        
      } catch(error) {
        console.log("View Error:", error.message)
      }           
    }

    getView()
  }, [viewId])
  
    return (      
        data ? <Resume templateId={templateId} editable={editable} initialData={data} />: <h4>Resume not found.</h4>
    )
}
