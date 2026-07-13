import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function MyActivityScreen({ onBack }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const user = await base44.auth.me();
        const records = await base44.entities.ActivityRecord.filter(
          { user_email: user.email },
          '-created_date'
        );
        setActivities(records);
      } catch (err) {
        console.error('Failed to load activities:', err);
      } finally {
        setLoading(false);
      }
    };
    loadActivities();
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const [userEmail, setUserEmail] = useState('');

  const handleDownloadCertificate = async (act) => {
    let name = userEmail;
    if (!name) {
      try {
        const user = await base44.auth.me();
        name = user.email || 'Elf Cleaner';
        setUserEmail(name);
      } catch {
        name = 'Elf Cleaner';
      }
    }

    // 16:9 landscape PDF (297mm x 167mm)
    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [297, 167] });

    // Background
    doc.setFillColor(240, 253, 244);
    doc.rect(0, 0, 297, 167, 'F');

    // Border
    doc.setDrawColor(74, 222, 128);
    doc.setLineWidth(2);
    doc.roundedRect(8, 8, 281, 151, 6, 6);

    // Title
    doc.setTextColor(22, 163, 74);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text('Cleanup Certificate', 148.5, 35, { align: 'center' });

    // Subtitle
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(75, 85, 99);
    doc.text('This certificate is proudly presented to', 148.5, 48, { align: 'center' });

    // Name
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(22, 101, 52);
    doc.text(name, 148.5, 62, { align: 'center' });

    // Decorative line
    doc.setDrawColor(134, 239, 172);
    doc.setLineWidth(0.8);
    doc.line(80, 68, 217, 68);

    // Data fields in a 2x2 grid
    const fields = [
      { label: 'Date', value: formatDate(act.created_date) },
      { label: 'Waste Collected', value: `${(act.waste_amount ?? 0).toFixed(1)} kg` },
      { label: 'Saved Plants', value: `${act.saved_plants ?? 0}` },
      { label: 'Saved Animals', value: `${act.saved_animals ?? 0}` },
    ];

    fields.forEach((field, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 50 + col * 100;
      const y = 85 + row * 25;

      doc.setFillColor(255, 255, 255);
      doc.roundedRect(x - 5, y - 8, 90, 20, 4, 4, 'F');
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(134, 197, 94);
      doc.text(field.label, x, y);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(22, 101, 52);
      doc.text(field.value, x, y + 6);
    });

    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(156, 163, 175);
    doc.text('Elf - Environmental Cleanup Tracker', 148.5, 150, { align: 'center' });

    doc.save(`Elf_Certificate_${formatDate(act.created_date)}.pdf`);
  };

  return (
    <div className="flex flex-col h-full" style={{ background: 'linear-gradient(160deg, #f0fdf4 0%, #ecfeff 100%)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4">
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-green-100 transition-colors">
          <ArrowLeft size={22} className="text-green-600" />
        </button>
        <h1 className="text-2xl font-black text-green-600 flex-1 text-center pr-8">My activity</h1>
      </div>

      {/* Activity list */}
      <div className="flex-1 overflow-y-auto px-5 pb-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-green-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">🌱</span>
            <p className="text-gray-400 font-medium">No activity yet.</p>
            <p className="text-gray-300 text-sm mt-1">Complete a cleanup to see it here!</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activities.map((act) => (
              <div key={act.id} className="bg-white rounded-3xl shadow-sm border border-green-50 p-5">
                <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                  <div>
                    <p className="text-xs font-medium text-green-400">Date</p>
                    <p className="text-sm font-bold text-green-600">{formatDate(act.created_date)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-400">Saved plant</p>
                    <p className="text-sm font-bold text-green-600">{act.saved_plants ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-400">Waste amount</p>
                    <p className="text-sm font-bold text-green-600">{(act.waste_amount ?? 0).toFixed(1)} kg</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-400">Saved Animal</p>
                    <p className="text-sm font-bold text-green-600">{act.saved_animals ?? 0}</p>
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <button
                    onClick={() => handleDownloadCertificate(act)}
                    className="flex items-center gap-1 text-xs font-bold text-green-500 hover:text-green-600 transition-colors"
                  >
                    <Download size={13} />
                    Download certificate
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}