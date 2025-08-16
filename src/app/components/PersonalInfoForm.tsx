"use client";
import React, { useState, useCallback } from 'react';
import { PersonalInfoForm as FormData } from '../agentConfigs/chatSupervisor3/sampleData';

interface PersonalInfoFormProps {
  onFieldUpdate?: (fieldId: string, value: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
}

export default function PersonalInfoForm({ onFieldUpdate, onSubmit, onClear }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fields: [
      { id: 'name', label: 'Full Name', type: 'text', required: true, value: '' },
      { id: 'age', label: 'Age', type: 'number', required: true, value: '' },
      { id: 'email', label: 'Email Address', type: 'email', required: true, value: '' },
      { id: 'phone', label: 'Phone Number', type: 'tel', required: false, value: '' },
      { id: 'placeOfBirth', label: 'Place of Birth', type: 'text', required: true, value: '' },
      { id: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true, value: '' },
      { id: 'occupation', label: 'Occupation', type: 'text', required: false, value: '' },
      { id: 'emergencyContact', label: 'Emergency Contact', type: 'text', required: false, value: '' }
    ]
  });

  const handleFieldChange = useCallback((fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, value } : field
      )
    }));
    onFieldUpdate?.(fieldId, value);
  }, [onFieldUpdate]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all required fields are filled
    const requiredFields = formData.fields.filter(field => field.required);
    const missingFields = requiredFields.filter(field => !field.value.trim());
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.map(f => f.label).join(', ')}`);
      return;
    }
    
    // Clear the form after successful submission
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => ({ ...field, value: '' }))
    }));
    
    onSubmit?.();
  }, [formData, onSubmit]);

  const handleClear = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => ({ ...field, value: '' }))
    }));
    onClear?.();
  }, [onClear]);

  // Function to update field from external source (like voice command)
  const updateField = useCallback((fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => 
        field.id === fieldId ? { ...field, value } : field
      )
    }));
  }, []);

  // Function to get current form status
  const getFormStatus = useCallback(() => {
    const requiredFields = formData.fields.filter(field => field.required);
    const completedRequiredFields = requiredFields.filter(field => field.value.trim());
    const optionalFields = formData.fields.filter(field => !field.required);
    const completedOptionalFields = optionalFields.filter(field => field.value.trim());
    
    return {
      requiredFields: requiredFields.map(f => ({ id: f.id, label: f.label, completed: !!f.value.trim() })),
      optionalFields: optionalFields.map(f => ({ id: f.id, label: f.label, completed: !!f.value.trim() })),
      completedRequiredCount: completedRequiredFields.length,
      totalRequiredCount: requiredFields.length,
      completedOptionalCount: completedOptionalFields.length,
      totalOptionalCount: optionalFields.length,
      allRequiredComplete: completedRequiredFields.length === requiredFields.length
    };
  }, [formData]);

  // Function to submit form programmatically
  const submitForm = useCallback(() => {
    const status = getFormStatus();
    if (!status.allRequiredComplete) {
      const missingFields = status.requiredFields.filter(f => !f.completed).map(f => f.label);
      console.warn(`Cannot submit form. Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }
    
    // Clear the form after successful submission
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => ({ ...field, value: '' }))
    }));
    
    onSubmit?.();
    return true;
  }, [getFormStatus, onSubmit]);

  // Function to clear form programmatically  
  const clearForm = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map(field => ({ ...field, value: '' }))
    }));
    onClear?.();
  }, [onClear]);

  // Expose functions globally for voice commands
  React.useEffect(() => {
    (window as any).updateFormField = updateField;
    (window as any).getFormStatus = getFormStatus;
    (window as any).submitForm = submitForm;
    (window as any).clearForm = clearForm;
    
    return () => {
      delete (window as any).updateFormField;
      delete (window as any).getFormStatus;
      delete (window as any).submitForm;
      delete (window as any).clearForm;
    };
  }, [updateField, getFormStatus, submitForm, clearForm]);

  const requiredFieldsCount = formData.fields.filter(field => field.required).length;
  const completedRequiredFields = formData.fields.filter(field => field.required && field.value.trim()).length;
  const allRequiredFieldsComplete = completedRequiredFields === requiredFieldsCount;

  return (
    <div className="bg-white border-l border-gray-200 w-80 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Personal Information Form</h2>
        <p className="text-sm text-gray-600 mt-1">
          Fill out the form manually or ask the assistant to help you
        </p>
        <div className="mt-2 text-xs text-gray-500">
          Required fields completed: {completedRequiredFields}/{requiredFieldsCount}
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
        {formData.fields.map((field) => (
          <div key={field.id} className="space-y-1">
            <label 
              htmlFor={field.id} 
              className="block text-sm font-medium text-gray-700"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              id={field.id}
              value={field.value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder={field.required ? `${field.label} (required)` : field.label}
            />
          </div>
        ))}
      </form>
      
      <div className="p-4 border-t border-gray-200 space-y-2">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!allRequiredFieldsComplete}
          className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            allRequiredFieldsComplete
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Submit Form
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="w-full py-2 px-4 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
        >
          Clear Form
        </button>
      </div>
    </div>
  );
}
