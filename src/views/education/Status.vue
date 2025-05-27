<template>
  <div class="status-page">
    
  </div>
</template>

<script>
export default {
  name: 'Status',
  data() {
    return {
      selectedCourse: 'all',
      selectedStatus: 'all',
      courses: [
        {
          name: '기초 과정 A반',
          instructor: '김강사',
          period: '2024.03.01 ~ 2024.03.31',
          students: 15,
          status: 'ongoing',
          type: 'basic'
        },
        {
          name: '중급 과정 B반',
          instructor: '이강사',
          period: '2024.02.01 ~ 2024.02.29',
          students: 12,
          status: 'completed',
          type: 'intermediate'
        },
        {
          name: '고급 과정 C반',
          instructor: '박강사',
          period: '2024.04.01 ~ 2024.04.30',
          students: 10,
          status: 'upcoming',
          type: 'advanced'
        }
      ]
    }
  },
  computed: {
    filteredCourses() {
      return this.courses.filter(course => {
        const courseMatch = this.selectedCourse === 'all' || course.type === this.selectedCourse
        const statusMatch = this.selectedStatus === 'all' || course.status === this.selectedStatus
        return courseMatch && statusMatch
      })
    },
    totalCourses() {
      return this.courses.length
    },
    ongoingCourses() {
      return this.courses.filter(course => course.status === 'ongoing').length
    },
    completedCourses() {
      return this.courses.filter(course => course.status === 'completed').length
    },
    upcomingCourses() {
      return this.courses.filter(course => course.status === 'upcoming').length
    }
  },
  methods: {
    getStatusText(status) {
      const statusMap = {
        ongoing: '수강중',
        completed: '수료',
        upcoming: '예정'
      }
      return statusMap[status] || status
    }
  }
}
</script>

<style scoped>
.status-page {
  padding: 20px;
}

.status-content {
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.status-content h2 {
  color: var(--primary-color);
  font-size: 2rem;
  margin-bottom: 40px;
  text-align: center;
}

.status-filters {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}

.filter-group {
  flex: 1;
}

.filter-group label {
  display: block;
  margin-bottom: 8px;
  color: #666;
  font-size: 0.9rem;
}

.filter-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  color: #333;
}

.status-table {
  margin-bottom: 40px;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

th {
  background-color: #f8f9fa;
  color: #333;
  font-weight: 600;
}

.status-badge {
  display: inline-block;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.status-badge.ongoing {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-badge.completed {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.status-badge.upcoming {
  background-color: #fff3e0;
  color: #f57c00;
}

.status-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.summary-item {
  text-align: center;
}

.summary-item h4 {
  color: #666;
  font-size: 1rem;
  margin-bottom: 10px;
}

.summary-item p {
  color: var(--primary-color);
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

@media (max-width: 768px) {
  .status-content {
    padding: 20px;
  }

  .status-content h2 {
    font-size: 1.8rem;
    margin-bottom: 30px;
  }

  .status-filters {
    flex-direction: column;
    gap: 15px;
  }

  .status-summary {
    grid-template-columns: repeat(2, 1fr);
  }

  th, td {
    padding: 10px;
    font-size: 0.9rem;
  }

  .status-badge {
    padding: 3px 8px;
    font-size: 0.8rem;
  }
}
</style> 