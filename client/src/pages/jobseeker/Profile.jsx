import { useState, useEffect } from 'react';
import axios from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { Loading, ErrorMessage, Input, TextArea } from '../../components';

const Profile = () => {
  const { user, loadUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    skills: '',
    experience: '',
    education: '',
  });

  const [resumeFile, setResumeFile] = useState(null);

  useEffect(() => {
    if (user?.profile) {
      setFormData({
        skills: user.profile.skills?.join(', ') || '',
        experience: user.profile.experience || '',
        education: user.profile.education || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        e.target.value = '';
        return;
      }

      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(file.type)) {
        setError('Only PDF, DOC, and DOCX files are allowed');
        e.target.value = '';
        return;
      }

      setResumeFile(file);
      setError('');
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const skillsArray = formData.skills
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      const profileData = {
        skills: skillsArray,
        experience: formData.experience,
        education: formData.education,
      };

      await axios.put('/auth/profile', profileData);
      await loadUser();
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleResumeSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      setError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setError('');
      setSuccess('');

      const resumeFormData = new FormData();
      resumeFormData.append('resume', resumeFile);

      await axios.post('/auth/upload-resume', resumeFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      await loadUser();
      setSuccess('Resume uploaded successfully!');
      setTimeout(() => setSuccess(''), 5000);
      setResumeFile(null);
      document.getElementById('resume-input').value = '';
    } catch (err) {
      console.error('Failed to upload resume:', err);
      setError(err.response?.data?.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-10 duration-700">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-24 h-24 md:w-32 md:h-32 bg-white/5 border-2 border-white/10 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-2xl backdrop-blur-xl">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-berkshire text-white mb-2">{user?.name}</h1>
            <p className="text-gray-400 text-lg flex items-center gap-2">
              <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              {user?.email}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-600/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold tracking-widest uppercase">
              Job Seeker Profile
            </div>
          </div>
        </div>
      </header>

      {error && <ErrorMessage message={error} />}

      {success && (
        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-2xl flex items-center gap-3 animate-in fade-in zoom-in duration-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="font-medium">{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[32px] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 md:p-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">Professional Profile</h2>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 flex justify-between items-end">
                    <span>Expertise & Skills</span>
                    <span className="text-[10px] text-gray-600 font-medium normal-case">Separated by commas</span>
                  </label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                    </div>
                    <input
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="e.g. React, Node.js, Python"
                      className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-2xl py-4 pl-12 pr-6 text-white placeholder-white/20 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Work Experience</label>
                  <div className="relative">
                    <textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Detail your professional journey..."
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-3xl p-6 text-white placeholder-white/20 outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Education</label>
                  <div className="relative">
                    <textarea
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="Detail your academic background..."
                      rows={5}
                      className="w-full bg-white/5 border border-white/10 focus:border-indigo-500/50 rounded-3xl p-6 text-white placeholder-white/20 outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-bold hover:scale-[1.02] transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                      Updating...
                    </div>
                  ) : 'Update Professional Profile'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Sidebar - Resume Upload */}
        <div className="space-y-8">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-600/10 transition-colors"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-purple-600 rounded-full"></div>
                <h2 className="text-xl font-bold text-white uppercase tracking-wider">Curriculum Vitae</h2>
              </div>

              {user?.profile?.resumeUrl && (
                <div className="mb-8 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center text-indigo-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                    <span className="text-indigo-400 font-bold text-sm tracking-wide">RESUME ACTIVE</span>
                  </div>
                  <a
                    href={user.profile.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center gap-2 w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-all active:scale-95"
                  >
                    View Current
                  </a>
                </div>
              )}

              <form onSubmit={handleResumeSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Upload New Resume</label>
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/10 hover:border-indigo-500/40 rounded-[28px] bg-white/5 hover:bg-white/10 transition-all cursor-pointer group/upload">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                      <svg className="w-10 h-10 mb-3 text-gray-500 group-hover/upload:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                      <p className="mb-2 text-sm text-gray-400"><span className="font-bold text-white">Click to upload</span> or drag and drop</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">PDF, DOC, DOCX (MAX 5MB)</p>
                    </div>
                    <input id="resume-input" type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
                  </label>
                </div>

                {resumeFile && (
                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <svg className="w-5 h-5 text-indigo-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.414a4 4 0 00-5.656-5.656l-6.415 6.414a6 6 0 108.486 8.486L20.5 13" /></svg>
                      <span className="text-xs text-gray-400 truncate font-medium">{resumeFile.name}</span>
                    </div>
                    <button type="button" onClick={() => { setResumeFile(null); document.getElementById('resume-input').value = ''; }} className="text-gray-500 hover:text-white transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l18 18" /></svg>
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading || !resumeFile}
                  className="w-full bg-white text-black py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 disabled:bg-gray-800 disabled:text-gray-400"
                >
                  {uploading ? 'Uploading...' : 'Upload Resume'}
                </button>
              </form>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[32px] p-1 shadow-2xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-white/10 group-hover:bg-transparent transition-colors duration-500"></div>
            <div className="relative bg-[#050015] rounded-[30px] p-8 h-full flex flex-col items-center justify-center text-center gap-6">
              <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-indigo-400 border border-white/5">
                <svg className="w-8 h-8 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Pro Tip</h3>
                <p className="text-gray-400 text-sm">Keep your professional summary up to date. Profiles with detailed experience get 3x more recruiter views.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
