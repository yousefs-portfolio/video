import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';
import {
  Lock,
  LockOpen,
  Star,
  EmojiEvents,
  TrendingUp,
  School,
  Code,
  Brush,
  Psychology,
  Science,
  Business,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

interface SkillNode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  level: number;
  maxLevel: number;
  xpRequired: number;
  xpCurrent: number;
  unlocked: boolean;
  prerequisites: string[];
  children: string[];
  category: string;
  rewards: string[];
}

interface SkillTreeProps {
  userId: string;
  onSkillUnlock?: (skillId: string) => void;
  onSkillUpgrade?: (skillId: string) => void;
}

const SkillTree: React.FC<SkillTreeProps> = ({ userId, onSkillUnlock, onSkillUpgrade }) => {
  const [skills, setSkills] = useState<Map<string, SkillNode>>(new Map());
  const [selectedSkill, setSelectedSkill] = useState<SkillNode | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [totalPoints, setTotalPoints] = useState(15);
  const [spentPoints, setSpentPoints] = useState(0);

  useEffect(() => {
    // Initialize skill tree
    const initialSkills = new Map<string, SkillNode>([
      ['programming-basics', {
        id: 'programming-basics',
        name: 'Programming Basics',
        description: 'Master the fundamentals of programming',
        icon: <Code />,
        level: 2,
        maxLevel: 5,
        xpRequired: 100,
        xpCurrent: 75,
        unlocked: true,
        prerequisites: [],
        children: ['web-dev', 'algorithms'],
        category: 'Technical',
        rewards: ['Variable Master Badge', '+10% XP on coding tasks'],
      }],
      ['web-dev', {
        id: 'web-dev',
        name: 'Web Development',
        description: 'Build modern web applications',
        icon: <Code />,
        level: 1,
        maxLevel: 5,
        xpRequired: 150,
        xpCurrent: 50,
        unlocked: true,
        prerequisites: ['programming-basics'],
        children: ['frontend', 'backend'],
        category: 'Technical',
        rewards: ['Web Developer Badge', 'Access to advanced projects'],
      }],
      ['algorithms', {
        id: 'algorithms',
        name: 'Algorithms & Data Structures',
        description: 'Optimize your problem-solving skills',
        icon: <Psychology />,
        level: 0,
        maxLevel: 5,
        xpRequired: 200,
        xpCurrent: 0,
        unlocked: false,
        prerequisites: ['programming-basics'],
        children: ['advanced-algorithms'],
        category: 'Technical',
        rewards: ['Algorithm Expert Badge', '+15% problem-solving speed'],
      }],
      ['frontend', {
        id: 'frontend',
        name: 'Frontend Mastery',
        description: 'Create beautiful user interfaces',
        icon: <Brush />,
        level: 0,
        maxLevel: 5,
        xpRequired: 175,
        xpCurrent: 0,
        unlocked: false,
        prerequisites: ['web-dev'],
        children: ['react', 'design-systems'],
        category: 'Technical',
        rewards: ['UI/UX Badge', 'Component Library Access'],
      }],
      ['backend', {
        id: 'backend',
        name: 'Backend Engineering',
        description: 'Build scalable server applications',
        icon: <Science />,
        level: 0,
        maxLevel: 5,
        xpRequired: 175,
        xpCurrent: 0,
        unlocked: false,
        prerequisites: ['web-dev'],
        children: ['databases', 'microservices'],
        category: 'Technical',
        rewards: ['Backend Expert Badge', 'Cloud Credits'],
      }],
      ['business', {
        id: 'business',
        name: 'Business Acumen',
        description: 'Understand business and product management',
        icon: <Business />,
        level: 1,
        maxLevel: 5,
        xpRequired: 120,
        xpCurrent: 40,
        unlocked: true,
        prerequisites: [],
        children: ['product-management', 'marketing'],
        category: 'Business',
        rewards: ['Business Strategist Badge', 'Networking Opportunities'],
      }],
      ['soft-skills', {
        id: 'soft-skills',
        name: 'Soft Skills',
        description: 'Improve communication and leadership',
        icon: <School />,
        level: 1,
        maxLevel: 5,
        xpRequired: 100,
        xpCurrent: 60,
        unlocked: true,
        prerequisites: [],
        children: ['leadership', 'communication'],
        category: 'Personal',
        rewards: ['Team Player Badge', 'Mentorship Access'],
      }],
    ]);

    setSkills(initialSkills);
    
    // Calculate spent points
    let spent = 0;
    initialSkills.forEach(skill => {
      spent += skill.level;
    });
    setSpentPoints(spent);
  }, [userId]);

  const handleSkillClick = (skillId: string) => {
    const skill = skills.get(skillId);
    if (skill) {
      setSelectedSkill(skill);
    }
  };

  const handleUpgradeSkill = () => {
    if (!selectedSkill || totalPoints - spentPoints <= 0) return;
    
    const updatedSkills = new Map(skills);
    const skill = updatedSkills.get(selectedSkill.id);
    
    if (skill && skill.level < skill.maxLevel) {
      skill.level += 1;
      skill.xpCurrent = 0;
      
      // Unlock children if this is the first level
      if (skill.level === 1) {
        skill.children.forEach(childId => {
          const child = updatedSkills.get(childId);
          if (child) {
            child.unlocked = true;
          }
        });
        
        if (onSkillUnlock) {
          onSkillUnlock(skill.id);
        }
      }
      
      setSkills(updatedSkills);
      setSpentPoints(spentPoints + 1);
      
      if (onSkillUpgrade) {
        onSkillUpgrade(skill.id);
      }
    }
  };

  const getSkillColor = (skill: SkillNode) => {
    if (!skill.unlocked) return '#666';
    if (skill.level === 0) return '#888';
    if (skill.level === skill.maxLevel) return '#FFD700';
    return '#4CAF50';
  };

  const renderSkillNode = (skill: SkillNode, x: number, y: number) => {
    const isHovered = hoveredSkill === skill.id;
    const color = getSkillColor(skill);
    
    return (
      <motion.div
        key={skill.id}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: Math.random() * 0.3 }}
        style={{
          position: 'absolute',
          left: x,
          top: y,
        }}
      >
        <Tooltip 
          title={
            <Box>
              <Typography variant="subtitle2">{skill.name}</Typography>
              <Typography variant="caption" display="block">
                Level {skill.level}/{skill.maxLevel}
              </Typography>
              <Typography variant="caption" display="block">
                {skill.xpCurrent}/{skill.xpRequired} XP
              </Typography>
            </Box>
          }
        >
          <Box
            onClick={() => handleSkillClick(skill.id)}
            onMouseEnter={() => setHoveredSkill(skill.id)}
            onMouseLeave={() => setHoveredSkill(null)}
            sx={{
              position: 'relative',
              width: 80,
              height: 80,
              cursor: skill.unlocked ? 'pointer' : 'not-allowed',
              transition: 'transform 0.2s',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
          >
            {/* Skill background */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                bgcolor: color,
                opacity: skill.unlocked ? 1 : 0.3,
                border: '3px solid',
                borderColor: skill.level > 0 ? color : 'transparent',
                boxShadow: isHovered ? `0 0 20px ${color}` : 'none',
              }}
            />
            
            {/* Skill icon */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                color: 'white',
                fontSize: 32,
              }}
            >
              {skill.unlocked ? skill.icon : <Lock />}
            </Box>
            
            {/* Level indicator */}
            {skill.level > 0 && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: -5,
                  right: -5,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: 'background.paper',
                  border: '2px solid',
                  borderColor: color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography variant="caption" fontWeight="bold">
                  {skill.level}
                </Typography>
              </Box>
            )}
            
            {/* Max level star */}
            {skill.level === skill.maxLevel && (
              <Star
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  color: '#FFD700',
                  fontSize: 24,
                }}
              />
            )}
          </Box>
        </Tooltip>
      </motion.div>
    );
  };

  const renderConnections = () => {
    const connections: JSX.Element[] = [];
    
    skills.forEach(skill => {
      skill.children.forEach(childId => {
        const child = skills.get(childId);
        if (child) {
          // Simple connection line rendering (would need proper positioning logic)
          connections.push(
            <svg
              key={`${skill.id}-${childId}`}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
              }}
            >
              <line
                x1="50"
                y1="50"
                x2="150"
                y2="150"
                stroke={skill.level > 0 ? '#4CAF50' : '#333'}
                strokeWidth="2"
                strokeDasharray={skill.level > 0 ? '0' : '5,5'}
                opacity={0.5}
              />
            </svg>
          );
        }
      });
    });
    
    return connections;
  };

  return (
    <Box sx={{ position: 'relative', minHeight: 600, p: 3 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Skill Tree</Typography>
          <Stack direction="row" spacing={2}>
            <Chip
              icon={<Star />}
              label={`${totalPoints - spentPoints} Points Available`}
              color="primary"
            />
            <Chip
              icon={<EmojiEvents />}
              label={`Level ${Math.floor(spentPoints / 3)}`}
              color="secondary"
            />
          </Stack>
        </Stack>
      </Paper>

      <Paper
        elevation={2}
        sx={{
          position: 'relative',
          height: 600,
          bgcolor: 'background.default',
          overflow: 'hidden',
          borderRadius: 2,
        }}
      >
        {/* Render connections first */}
        {renderConnections()}
        
        {/* Render skill nodes */}
        {renderSkillNode(skills.get('programming-basics')!, 350, 50)}
        {renderSkillNode(skills.get('web-dev')!, 250, 180)}
        {renderSkillNode(skills.get('algorithms')!, 450, 180)}
        {renderSkillNode(skills.get('frontend')!, 150, 310)}
        {renderSkillNode(skills.get('backend')!, 350, 310)}
        {renderSkillNode(skills.get('business')!, 550, 50)}
        {renderSkillNode(skills.get('soft-skills')!, 150, 50)}
      </Paper>

      {/* Skill Detail Dialog */}
      <Dialog
        open={!!selectedSkill}
        onClose={() => setSelectedSkill(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedSkill && (
          <>
            <DialogTitle>
              <Stack direction="row" alignItems="center" spacing={1}>
                {selectedSkill.icon}
                <Typography variant="h6">{selectedSkill.name}</Typography>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2}>
                <Typography>{selectedSkill.description}</Typography>
                
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Progress
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={(selectedSkill.xpCurrent / selectedSkill.xpRequired) * 100}
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="caption">
                    {selectedSkill.xpCurrent} / {selectedSkill.xpRequired} XP
                  </Typography>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Level
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {Array.from({ length: selectedSkill.maxLevel }).map((_, i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          bgcolor: i < selectedSkill.level ? 'primary.main' : 'grey.300',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {i < selectedSkill.level ? <Star sx={{ color: 'white' }} /> : ''}
                      </Box>
                    ))}
                  </Stack>
                </Box>
                
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Rewards
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    {selectedSkill.rewards.map((reward, index) => (
                      <Chip
                        key={index}
                        label={reward}
                        size="small"
                        color={selectedSkill.level > 0 ? 'primary' : 'default'}
                      />
                    ))}
                  </Stack>
                </Box>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedSkill(null)}>Close</Button>
              {selectedSkill.unlocked && selectedSkill.level < selectedSkill.maxLevel && (
                <Button
                  variant="contained"
                  onClick={handleUpgradeSkill}
                  disabled={totalPoints - spentPoints <= 0}
                  startIcon={<TrendingUp />}
                >
                  Upgrade ({totalPoints - spentPoints} points)
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default SkillTree;