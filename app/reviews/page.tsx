'use client';

import { LayoutWrapper } from '@/components/layout-wrapper';
import { useApp } from '@/lib/app-context';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, Stethoscope } from 'lucide-react';
import { useState } from 'react';

export default function ReviewsPage() {
  const { reviews, patients, currentUser } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  // Filter reviews based on current user (doctors see their own and all, nurses see none)
  const userReviews = currentUser?.role === 'doctor' ? reviews : [];

  const filteredReviews = userReviews.filter((r) => {
    const patient = patients.find((p) => p.id === r.patientId);
    return patient?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const approvedCount = filteredReviews.filter((r) => r.status === 'approved').length;
  const rejectedCount = filteredReviews.filter((r) => r.status === 'rejected').length;

  return (
    <LayoutWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Doctor Reviews</h1>
          <p className="text-slate-600 mt-1">Medical reviews and assessments</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search by patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Stethoscope className="w-5 h-5 text-blue-600 opacity-70" />
              <div>
                <p className="text-xs text-slate-600">Total Reviews</p>
                <p className="text-2xl font-bold text-slate-900">{filteredReviews.length}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Stethoscope className="w-5 h-5 text-green-600 opacity-70" />
              <div>
                <p className="text-xs text-slate-600">Approved</p>
                <p className="text-2xl font-bold text-slate-900">{approvedCount}</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center gap-3">
              <Stethoscope className="w-5 h-5 text-red-600 opacity-70" />
              <div>
                <p className="text-xs text-slate-600">Rejected</p>
                <p className="text-2xl font-bold text-slate-900">{rejectedCount}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review) => {
              const patient = patients.find((p) => p.id === review.patientId);
              const doctor = { name: currentUser?.name || 'Unknown Doctor' };

              return (
                <Card key={review.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{patient?.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">
                        Reviewed by {doctor.name} on{' '}
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant={review.status === 'approved' ? 'default' : 'destructive'}>
                      {review.status}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Clinical Findings</h4>
                      <p className="text-slate-700 whitespace-pre-wrap">{review.findings}</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-slate-900 mb-2">Treatment Plan</h4>
                      <p className="text-slate-700 whitespace-pre-wrap">{review.treatment}</p>
                    </div>

                    {review.notes && (
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Notes</h4>
                        <p className="text-slate-700 whitespace-pre-wrap">{review.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500">
                      Last updated: {new Date(review.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </Card>
              );
            })
          ) : (
            <Card className="p-8 text-center">
              <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">
                {filteredReviews.length === 0 && userReviews.length === 0
                  ? 'No reviews yet'
                  : 'No reviews match your search'}
              </p>
            </Card>
          )}
        </div>
      </div>
    </LayoutWrapper>
  );
}
