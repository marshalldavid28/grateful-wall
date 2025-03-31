
import React from 'react';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Testimonial } from '@/utils/testimonials';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface TestimonialsTableProps {
  testimonials: Testimonial[];
  deletingId: string | null;
  approvingId: string | null;
  onDelete: (id: string) => void;
  onApprove: (id: string, approve: boolean) => void;
  showApprovedOnly: boolean;
  onToggleShowApproved: () => void;
}

export const TestimonialsTable: React.FC<TestimonialsTableProps> = ({
  testimonials,
  deletingId,
  approvingId,
  onDelete,
  onApprove,
  showApprovedOnly,
  onToggleShowApproved
}) => {
  // Filter testimonials based on approval status if needed
  const filteredTestimonials = showApprovedOnly 
    ? testimonials.filter(t => t.approved)
    : testimonials;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {showApprovedOnly ? 'Approved Testimonials' : 'All Testimonials'}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Show approved only:</span>
          <Switch 
            checked={showApprovedOnly}
            onCheckedChange={onToggleShowApproved}
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Content</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTestimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center">
                  No testimonials found
                </TableCell>
              </TableRow>
            ) : (
              filteredTestimonials.map((testimonial) => (
                <TableRow key={testimonial.id}>
                  <TableCell className="font-medium truncate max-w-xs">
                    {testimonial.type === 'linkedin' ? (
                      <div className="flex items-center">
                        <span className="text-blue-600 mr-1.5">LinkedIn:</span>
                        {testimonial.imageUrl ? (
                          <span className="text-green-600">Has screenshot</span>
                        ) : (
                          <span className="italic text-muted-foreground">No screenshot</span>
                        )}
                      </div>
                    ) : (
                      <span className="italic">{testimonial.text.substring(0, 70)}...</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span>{testimonial.name}</span>
                      <span className="text-muted-foreground text-xs">
                        {testimonial.role && testimonial.company 
                          ? `${testimonial.role} at ${testimonial.company}`
                          : testimonial.role || testimonial.company || ''}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={cn(
                      "flex items-center gap-1.5",
                      testimonial.approved ? "text-green-600" : "text-amber-600"
                    )}>
                      {testimonial.approved ? (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Approved</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4" />
                          <span>Pending</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {!testimonial.approved && (
                        <Button
                          variant="ghost" 
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => onApprove(testimonial.id, true)}
                          disabled={approvingId === testimonial.id}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                      )}
                      
                      {testimonial.approved && (
                        <Button
                          variant="ghost" 
                          size="sm"
                          className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                          onClick={() => onApprove(testimonial.id, false)}
                          disabled={approvingId === testimonial.id}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Unapprove
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost" 
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onDelete(testimonial.id)}
                        disabled={deletingId === testimonial.id}
                      >
                        {deletingId === testimonial.id ? (
                          <div className="animate-spin h-4 w-4 border-t-2 border-red-500 rounded-full mr-1" />
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                              <path d="M3 6h18"></path>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            </svg>
                            Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
